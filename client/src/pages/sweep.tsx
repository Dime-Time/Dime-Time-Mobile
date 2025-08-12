import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Building2, 
  ArrowRight,
  Coins,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function SweepAccountPage() {
  const { toast } = useToast();
  
  const { data: sweepSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ["/api/sweep/summary"],
    retry: false,
  });

  const { data: deposits = [], isLoading: depositsLoading } = useQuery({
    queryKey: ["/api/sweep/deposits"],
    retry: false,
  });

  const { data: dispersals = [], isLoading: dispersalsLoading } = useQuery({
    queryKey: ["/api/sweep/dispersals"],
    retry: false,
  });

  const triggerDispersal = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/sweep/disperse", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to trigger dispersal");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Dispersal Triggered",
        description: "Weekly debt payments have been processed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/sweep/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sweep/dispersals"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process weekly dispersals",
        variant: "destructive",
      });
    },
  });

  if (summaryLoading || depositsLoading || dispersalsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-pulse">Loading sweep account...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!sweepSummary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            JP Morgan Chase Sweep Account
          </h2>
          <p className="text-slate-600 mb-6">
            Set up a sweep account to automatically collect round-ups and earn interest
          </p>
          <Button className="bg-dime-purple hover:bg-dime-accent">
            Create Sweep Account
          </Button>
        </div>
      </div>
    );
  }

  const nextFridayDate = new Date(sweepSummary.nextDispersalDate);
  const daysUntilDispersal = Math.ceil((nextFridayDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          JP Morgan Chase Sweep Account
        </h1>
        <p className="text-slate-600">
          Your round-ups are earning interest and will be dispersed to debt payments every Friday
        </p>
      </div>

      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Current Balance</p>
                <p className="text-2xl font-bold text-slate-900">
                  ${sweepSummary.currentBalance.toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-dime-purple" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Interest Earned</p>
                <p className="text-2xl font-bold text-green-600">
                  ${sweepSummary.interestEarned.toFixed(4)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Weekly Projection</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${sweepSummary.weeklyProjection.toFixed(2)}
                </p>
              </div>
              <Coins className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Next Dispersal</p>
                <p className="text-lg font-bold text-slate-900">
                  {daysUntilDispersal} days
                </p>
                <p className="text-xs text-slate-500">
                  {nextFridayDate.toLocaleDateString()}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Details & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              Your JP Morgan Chase sweep account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Account Number</span>
              <span className="font-mono">{sweepSummary.account.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Routing Number</span>
              <span className="font-mono">{sweepSummary.account.routingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Interest Rate</span>
              <span className="text-green-600 font-semibold">
                {(parseFloat(sweepSummary.account.interestRate) * 100).toFixed(2)}% APY
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Status</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your sweep account and dispersals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => triggerDispersal.mutate()}
              disabled={triggerDispersal.isPending || sweepSummary.currentBalance < 5}
              className="w-full bg-dime-purple hover:bg-dime-accent"
            >
              {triggerDispersal.isPending ? (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Trigger Early Dispersal
                </div>
              )}
            </Button>
            
            <div className="text-xs text-slate-500 text-center">
              {sweepSummary.currentBalance < 5 
                ? "Minimum $5.00 balance required for dispersal" 
                : "This will immediately send funds to your highest priority debt"
              }
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Progress to next auto-dispersal</span>
                <span>{Math.max(0, 7 - daysUntilDispersal)}/7 days</span>
              </div>
              <Progress 
                value={Math.max(0, (7 - daysUntilDispersal) / 7 * 100)} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Round-Up Deposits</CardTitle>
          <CardDescription>
            Your latest round-up collections earning interest
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deposits.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Coins className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No round-up deposits yet</p>
              <p className="text-sm">Make some purchases to start collecting round-ups!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deposits.slice(0, 5).map((deposit: any) => (
                <div key={deposit.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-dime-purple/10 rounded-full flex items-center justify-center">
                      <Coins className="w-4 h-4 text-dime-purple" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        Round-up Collection
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(deposit.depositDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      ${parseFloat(deposit.roundUpAmount).toFixed(2)}
                    </p>
                    <p className="text-xs text-green-600">
                      +${parseFloat(deposit.interestEarned).toFixed(4)} interest
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}