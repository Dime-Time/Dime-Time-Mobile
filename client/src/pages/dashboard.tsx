import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DebtProgressChart } from "@/components/debt-progress-chart";
import { PaymentModal } from "@/components/payment-modal";
import { formatCurrency, formatTime, formatDate, calculateDebtProgress } from "@/lib/calculations";
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  ShoppingBag,
  Car,
  Coffee,
  Plus,
  ArrowUp
} from "lucide-react";
import type { Transaction, Debt } from "@shared/schema";
import transparentLogoImage from "@assets/D22C55D0-9527-4CE7-863F-F9327653E73E_1756052612472.png";

interface DashboardSummary {
  totalDebt: string;
  totalRoundUps: string;
  thisMonthRoundUps: string;
  thisMonthPayments: string;
  progressPercentage: number;
  debtFreeDate: string;
  debtsCount: number;
}

export default function Dashboard() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: summary } = useQuery<DashboardSummary>({
    queryKey: ["/api/dashboard-summary"],
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    staleTime: 30000,
  });

  const { data: debts = [] } = useQuery<Debt[]>({
    queryKey: ["/api/debts"],
  });

  const recentTransactions = transactions.slice(0, 4);
  const weekRoundUps = transactions
    .filter(t => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(t.date) >= weekAgo;
    })
    .reduce((sum, t) => sum + parseFloat(t.roundUpAmount), 0);

  // Mock chart data - in a real app this would come from historical data
  const chartData = [30500, 29200, 28100, 26800, 25600, 24300, parseFloat(summary?.totalDebt || "23847"), 22500, 21200, 19800, 18400, 17000];
  const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

  if (!summary || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 relative" style={{ zIndex: 100 }}>
      {/* Logo in upper left corner */}
      <div className="absolute top-4 left-4">
        <img 
          src={transparentLogoImage} 
          alt="Dime Time Logo" 
          className="w-12 h-12 object-contain logo-clean"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)`,
            backgroundColor: 'transparent'
          }}
        />
      </div>
      
      {/* Dime Time Header - At Very Top */}
      <div className="mb-4 pt-2 relative z-50" style={{ zIndex: 100 }}>
        <h1 className="text-4xl font-black text-white mb-6 text-center relative" style={{ zIndex: 100 }}>
          Dime Time
        </h1>
      </div>

      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome back, <span className="text-white/90">{user?.firstName || 'User'}</span>!
        </h2>
        <p className="text-slate-600">
          You've saved <span className="font-semibold text-dime-accent">{formatCurrency(summary.thisMonthRoundUps)}</span> in round-ups this month 
          and paid down <span className="font-semibold text-dime-purple">{formatCurrency(summary.thisMonthPayments)}</span> in debt.
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-dime-purple/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-dime-purple" />
              </div>
              <span className="text-xs text-dime-accent font-medium">+{formatCurrency(summary.thisMonthRoundUps)}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">Round-Up Balance</h3>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(summary.totalRoundUps)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xs text-red-600 font-medium">-{formatCurrency(summary.thisMonthPayments)}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">Total Debt</h3>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(summary.totalDebt)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-dime-accent/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-dime-accent" />
              </div>
              <span className="text-xs text-dime-accent font-medium">{summary.progressPercentage}%</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">Progress This Year</h3>
            <p className="text-2xl font-bold text-slate-900">{summary.progressPercentage}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-dime-lilac/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-dime-lilac" />
              </div>
              <span className="text-xs text-slate-600 font-medium">Est.</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">Debt Free Date</h3>
            <p className="text-2xl font-bold text-slate-900">{summary.debtFreeDate}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions & Round-ups */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Recent Transactions</h2>
                <Button variant="ghost" className="text-dime-purple hover:text-dime-purple/80 text-sm font-medium">
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(transaction.category)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{transaction.merchant}</p>
                        <p className="text-sm text-slate-600">
                          {formatDate(transaction.date)}, {formatTime(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">-{formatCurrency(transaction.amount)}</p>
                      <p className="text-sm text-dime-accent">+{formatCurrency(transaction.roundUpAmount)} round-up</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Round-up Summary */}
              <div className="mt-6 p-4 bg-gradient-to-r from-dime-purple/10 to-dime-lilac/10 rounded-lg border border-dime-purple/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Round-ups this week</p>
                    <p className="text-lg font-bold text-dime-accent">{formatCurrency(weekRoundUps)}</p>
                  </div>
                  <Button 
                    className="bg-dime-accent text-white hover:bg-dime-accent/90"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    Apply to Debt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debt Overview */}
        <div className="space-y-6">
          {/* Debt Progress Chart */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Debt Reduction Progress</h3>
              <DebtProgressChart 
                data={chartData}
                labels={chartLabels}
                className="h-48"
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-600">
                  You're <span className="font-semibold text-dime-accent">3 months ahead</span> of your original timeline!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Active Debts */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Active Debts</h3>
                <Button variant="ghost" className="text-dime-purple hover:text-dime-purple/80 text-sm font-medium">
                  Manage
                </Button>
              </div>

              <div className="space-y-4">
                {debts.map((debt) => {
                  const progress = calculateDebtProgress(debt.originalBalance, debt.currentBalance);
                  const monthsLeft = Math.ceil(parseFloat(debt.currentBalance) / parseFloat(debt.minimumPayment));
                  
                  return (
                    <div key={debt.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-slate-900">{debt.name}</h4>
                          <p className="text-sm text-slate-600">{debt.accountNumber}</p>
                        </div>
                        <span className="text-sm font-medium text-red-600">{formatCurrency(debt.currentBalance)}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-gradient-to-r from-dime-purple to-dime-accent h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>{progress}% paid</span>
                        <span>{monthsLeft} months left</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-dime-purple text-white hover:bg-dime-purple/90 flex items-center justify-center space-x-2"
                  onClick={() => setShowPaymentModal(true)}
                >
                  <Plus className="w-5 h-5" />
                  <span>Make Extra Payment</span>
                </Button>
                <Button className="w-full bg-dime-accent text-white hover:bg-dime-accent/90 flex items-center justify-center space-x-2">
                  <ArrowUp className="w-5 h-5" />
                  <span>Boost Round-ups</span>
                </Button>
                <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>View Insights</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Educational Content Section */}
      <div className="mt-12">
        <div className="bg-gradient-to-r from-dime-purple to-dime-lilac rounded-xl p-8 text-white">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">💡 Dime Time Tip: Accelerate Your Debt Freedom</h2>
            <p className="text-lg mb-6 opacity-90">
              Did you know that increasing your round-ups by just $1 per transaction could help you pay off debt 6 months faster? 
              Small changes make a big difference over time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-dime-purple hover:bg-slate-50">
                Learn More Strategies
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Customize Round-ups
              </Button>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        debts={debts}
        roundUpBalance={parseFloat(summary.totalRoundUps)}
      />
    </main>
  );
}
