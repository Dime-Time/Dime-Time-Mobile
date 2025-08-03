import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PaymentModal } from "@/components/payment-modal";
import { formatCurrency, calculateDebtProgress, estimatePayoffMonths } from "@/lib/calculations";
import { CreditCard, TrendingDown, Calendar, Plus, DollarSign } from "lucide-react";
import type { Debt, Payment } from "@shared/schema";

export default function Debts() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { data: debts = [], isLoading } = useQuery<Debt[]>({
    queryKey: ["/api/debts"],
  });

  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.currentBalance), 0);
  const totalOriginalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.originalBalance), 0);
  const totalMinimumPayments = debts.reduce((sum, debt) => sum + parseFloat(debt.minimumPayment), 0);
  const overallProgress = totalOriginalDebt > 0 ? ((totalOriginalDebt - totalDebt) / totalOriginalDebt) * 100 : 0;

  const thisMonthPayments = payments
    .filter(payment => {
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      return new Date(payment.date) >= thisMonth;
    })
    .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Debt Management</h1>
          <p className="text-slate-600">Track and manage your debt payoff journey</p>
        </div>
        <Button 
          className="bg-dime-blue hover:bg-dime-blue/90"
          onClick={() => setShowPaymentModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Make Payment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Total Debt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt)}</p>
            <p className="text-xs text-slate-500 mt-1">
              Down from {formatCurrency(totalOriginalDebt)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-dime-green">{overallProgress.toFixed(1)}%</p>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Min. Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalMinimumPayments)}</p>
            <p className="text-xs text-slate-500 mt-1">Per month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-dime-blue">{formatCurrency(thisMonthPayments)}</p>
            <p className="text-xs text-slate-500 mt-1">Payments made</p>
          </CardContent>
        </Card>
      </div>

      {/* Debt Cards */}
      <div className="space-y-6">
        {debts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No debts found</h3>
              <p className="text-slate-500">Add your first debt to start tracking your payoff progress</p>
              <Button className="mt-4 bg-dime-blue hover:bg-dime-blue/90">
                Add Debt Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          debts.map((debt) => {
            const progress = calculateDebtProgress(debt.originalBalance, debt.currentBalance);
            const monthsLeft = estimatePayoffMonths(debt.currentBalance, parseFloat(debt.minimumPayment));
            const debtPayments = payments.filter(p => p.debtId === debt.id);
            const totalPaid = parseFloat(debt.originalBalance) - parseFloat(debt.currentBalance);
            
            return (
              <Card key={debt.id} className="overflow-hidden">
                <CardHeader className="bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-slate-900">{debt.name}</CardTitle>
                      <p className="text-slate-600 mt-1">{debt.accountNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">{formatCurrency(debt.currentBalance)}</p>
                      <p className="text-sm text-slate-500">of {formatCurrency(debt.originalBalance)}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-slate-600 mb-1">Interest Rate</h4>
                      <p className="text-lg font-semibold text-slate-900">{debt.interestRate}%</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-600 mb-1">Minimum Payment</h4>
                      <p className="text-lg font-semibold text-slate-900">{formatCurrency(debt.minimumPayment)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-600 mb-1">Due Date</h4>
                      <p className="text-lg font-semibold text-slate-900">{debt.dueDate}th of month</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-slate-600">Payoff Progress</h4>
                      <span className="text-sm font-medium text-dime-green">{progress}% complete</span>
                    </div>
                    <Progress value={progress} className="mb-2" />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Paid: {formatCurrency(totalPaid)}</span>
                      <span>Remaining: {formatCurrency(debt.currentBalance)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-dime-blue/5 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-slate-600 mb-1">Estimated Payoff</h4>
                      <p className="text-lg font-semibold text-dime-blue">{monthsLeft} months</p>
                      <p className="text-xs text-slate-500">At minimum payments</p>
                    </div>
                    <div className="bg-dime-green/5 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-slate-600 mb-1">Total Payments</h4>
                      <p className="text-lg font-semibold text-dime-green">{debtPayments.length}</p>
                      <p className="text-xs text-slate-500">This year</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-dime-blue hover:bg-dime-blue/90"
                      onClick={() => setShowPaymentModal(true)}
                    >
                      Make Payment
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Debt Strategy Tips */}
      <div className="mt-8">
        <Card className="bg-gradient-to-r from-dime-blue/5 to-dime-teal/5 border-dime-blue/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">💡 Debt Payoff Strategies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Debt Avalanche</h4>
                <p className="text-sm text-slate-600">
                  Pay minimums on all debts, then put extra money toward the highest interest rate debt first. 
                  This saves the most money on interest over time.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Debt Snowball</h4>
                <p className="text-sm text-slate-600">
                  Pay minimums on all debts, then put extra money toward the smallest balance first. 
                  This provides psychological wins and momentum.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        debts={debts}
        roundUpBalance={0} // This would come from summary data in a real app
      />
    </main>
  );
}
