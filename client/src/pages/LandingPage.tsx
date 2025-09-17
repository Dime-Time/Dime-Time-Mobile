import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoWithText } from "@/components/logo";
import { DollarSign, TrendingUp, Shield, Smartphone, Clock } from "lucide-react";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-[#918EF4] text-white flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <LogoWithText />
          <Button 
            onClick={handleLogin}
            className="bg-white text-[#918EF4] hover:bg-gray-100 font-semibold"
            data-testid="button-login"
          >
            Sign In with Replit
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Get Out of Debt
            <br />
            <span className="text-white/90">One Dime at a Time</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
            Transform your spare change into debt freedom through automated round-up investments and smart financial tracking.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleLogin}
              size="lg"
              className="bg-white text-[#918EF4] hover:bg-gray-100 font-semibold text-lg px-8 py-4"
              data-testid="button-get-started"
            >
              Get Started Free
            </Button>
            <p className="text-white/60 text-sm">
              Sign in with your Replit account
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Round-Up Technology</CardTitle>
              <CardDescription className="text-white/70">
                Automatically collect spare change from every purchase and apply it to your debt.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Smart Analytics</CardTitle>
              <CardDescription className="text-white/70">
                Track your progress with detailed insights and debt-free projections.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Bank-Level Security</CardTitle>
              <CardDescription className="text-white/70">
                Your financial data is protected with enterprise-grade security.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Mobile Apps</CardTitle>
              <CardDescription className="text-white/70">
                Access Dime Time on iOS and Android for debt management on the go.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Automated Payments</CardTitle>
              <CardDescription className="text-white/70">
                Weekly automated payments to accelerate your debt reduction journey.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Crypto Options</CardTitle>
              <CardDescription className="text-white/70">
                Optionally invest round-ups in cryptocurrency for potential growth.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 text-center text-white/60">
        <p>&copy; 2025 Dime Time. Get out of debt one dime at a time.</p>
      </footer>
    </div>
  );
}