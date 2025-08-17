import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, TrendingUp, CreditCard, Smartphone } from "lucide-react";
import { LogoWithText } from "@/components/logo";

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--dime-background)' }}>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <LogoWithText size={150} />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Turn Spare Change into 
            <span className="text-white"> Debt Freedom</span>
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Dime Time transforms your everyday purchases into powerful debt reduction through 
            automated round-ups and intelligent micro-investments with JP Morgan Chase integration.
          </p>
          
          <Button 
            size="lg" 
            className="text-lg px-8 py-4 text-white border border-white hover:bg-white hover:text-black"
            style={{ backgroundColor: 'transparent' }}
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Smart Features for Smarter Savings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: 'var(--dime-background)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg text-white">Round-Up Technology</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white text-center">
                Automatically round up purchases to the nearest dollar and apply the difference to your highest-interest debt.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: 'var(--dime-background)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg text-white">JP Morgan Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white text-center">
                Secure sweep accounts with competitive interest rates while your round-ups accumulate for maximum impact.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: 'var(--dime-background)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg text-white">Smart Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white text-center">
                Track progress with detailed insights, debt-free projections, and optimization recommendations.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: 'var(--dime-background)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg text-white">One-Tap Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white text-center">
                Make accelerated debt payments instantly with our streamlined interface and QR code system.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16" style={{ backgroundColor: 'var(--dime-background)' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who have accelerated their debt payoff with our innovative round-up technology.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-4 text-white border border-white hover:bg-white hover:text-black"
            style={{ backgroundColor: 'transparent' }}
            onClick={() => window.location.href = '/api/login'}
          >
            Start Your Journey Today
          </Button>
        </div>
      </div>
    </div>
  );
}