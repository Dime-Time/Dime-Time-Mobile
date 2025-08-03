import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatTime } from "@/lib/calculations";
import { Coffee, Car, ShoppingBag, DollarSign, Plus } from "lucide-react";
import type { Transaction } from "@shared/schema";

export default function Transactions() {
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food & drink':
        return <Coffee className="w-5 h-5 text-green-600" />;
      case 'transportation':
        return <Car className="w-5 h-5 text-blue-600" />;
      case 'shopping':
      case 'groceries':
        return <ShoppingBag className="w-5 h-5 text-purple-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  const totalRoundUps = transactions.reduce((sum, trans) => sum + parseFloat(trans.roundUpAmount), 0);
  const thisMonthRoundUps = transactions
    .filter(trans => {
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      return new Date(trans.date) >= thisMonth;
    })
    .reduce((sum, trans) => sum + parseFloat(trans.roundUpAmount), 0);

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
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 rounded-lg"></div>
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Transactions</h1>
          <p className="text-slate-600">Track your purchases and round-up savings</p>
        </div>
        <Button className="bg-dime-purple hover:bg-dime-purple/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Round-ups</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-dime-accent">{formatCurrency(totalRoundUps)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-dime-purple">{formatCurrency(thisMonthRoundUps)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">{transactions.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No transactions found</p>
                <p className="text-sm text-slate-400 mt-1">Your transactions will appear here once you start using Dime Time</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">{transaction.merchant}</p>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        {formatDate(transaction.date)} at {formatTime(transaction.date)}
                      </p>
                      {transaction.description && (
                        <p className="text-xs text-slate-500 mt-1">{transaction.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">-{formatCurrency(transaction.amount)}</p>
                    <div className="flex items-center gap-1 text-sm text-dime-accent">
                      <Plus className="w-3 h-3" />
                      <span>{formatCurrency(transaction.roundUpAmount)} round-up</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Round-up Explanation */}
      <div className="mt-8">
        <Card className="bg-gradient-to-r from-dime-purple/5 to-dime-lilac/5 border-dime-purple/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">How Round-ups Work</h3>
            <p className="text-slate-600 mb-4">
              Every purchase is automatically rounded up to the nearest dollar. The spare change is collected 
              and can be applied to your debt payments to accelerate your path to financial freedom.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-slate-900 mb-1">Example 1:</h4>
                <p className="text-slate-600">$4.67 coffee purchase → $0.33 round-up</p>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-1">Example 2:</h4>
                <p className="text-slate-600">$37.42 gas purchase → $0.58 round-up</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
