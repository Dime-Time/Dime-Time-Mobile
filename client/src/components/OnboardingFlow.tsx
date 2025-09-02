import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Coins, Target, TrendingUp, Sparkles, CheckCircle, Play } from "lucide-react";

interface OnboardingFlowProps {
  userName: string;
  onComplete: () => void;
}

export default function OnboardingFlow({ userName, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'welcome',
      title: `Welcome to Dime Time, ${userName}!`,
      subtitle: "Your journey to debt freedom starts now",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-dime-purple/10 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-12 h-12 text-dime-purple" />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">
              Get out of debt one dime at a time
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Dime Time automatically rounds up your purchases and uses that spare change to pay down your debt faster than you ever thought possible.
            </p>
          </div>
          <div className="bg-dime-purple/5 p-4 rounded-lg border border-dime-purple/10">
            <p className="text-sm text-slate-700">
              <strong>Example:</strong> Buy coffee for $4.75 → We round up to $5.00 → $0.25 goes to debt payment
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'how-it-works',
      title: "Here's How It Works",
      subtitle: "Three simple steps to financial freedom",
      content: (
        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-start gap-4 p-4 bg-dime-accent/5 rounded-lg border border-dime-accent/10">
              <div className="w-8 h-8 bg-dime-accent rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Smart Round-ups</h4>
                <p className="text-sm text-slate-600">Every purchase gets rounded up to the nearest dollar automatically</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-dime-purple/5 rounded-lg border border-dime-purple/10">
              <div className="w-8 h-8 bg-dime-purple rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Weekly Payments</h4>
                <p className="text-sm text-slate-600">Your round-ups are collected and sent to your highest-interest debt</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-dime-lilac/5 rounded-lg border border-dime-lilac/10">
              <div className="w-8 h-8 bg-dime-lilac rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Track Progress</h4>
                <p className="text-sm text-slate-600">Watch your debt shrink and see your projected debt-free date</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: "Powerful Features Included",
      subtitle: "Everything you need for financial success",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-dime-purple/10 rounded-lg flex items-center justify-center">
                <Coins className="w-5 h-5 text-dime-purple" />
              </div>
              <h4 className="font-semibold text-slate-900">Crypto Integration</h4>
            </div>
            <p className="text-sm text-slate-600">Optional: Invest round-ups in Bitcoin and use gains for extra debt payments</p>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-dime-accent/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-dime-accent" />
              </div>
              <h4 className="font-semibold text-slate-900">Smart Analytics</h4>
            </div>
            <p className="text-sm text-slate-600">See exactly when you'll be debt-free and track your progress daily</p>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-dime-lilac/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-dime-lilac" />
              </div>
              <h4 className="font-semibold text-slate-900">Debt Optimization</h4>
            </div>
            <p className="text-sm text-slate-600">Automatically targets highest-interest debt first for maximum savings</p>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-slate-900">Bank Integration</h4>
            </div>
            <p className="text-sm text-slate-600">Secure connections to 11,000+ banks and credit unions</p>
          </div>
        </div>
      )
    },
    {
      id: 'success-story',
      title: "Real Results",
      subtitle: "See what's possible with Dime Time",
      content: (
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-dime-purple/10 to-dime-accent/10 p-6 rounded-lg border border-dime-purple/20">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Average Dime Time User Results
              </h3>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-dime-purple">$47</div>
                  <div className="text-sm text-slate-600">Weekly round-ups</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-dime-accent">18</div>
                  <div className="text-sm text-slate-600">Months faster</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-dime-lilac">$3,200</div>
                  <div className="text-sm text-slate-600">Interest saved</div>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 italic">
                "I paid off my $8,000 credit card debt 18 months faster just with round-ups. It felt effortless!" - Sarah M.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ready',
      title: "Ready to Start?",
      subtitle: "Your debt-free journey begins now",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Play className="w-12 h-12 text-green-600" />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">
              Let's set up your account!
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Connect your bank account to start tracking purchases and see your first round-ups within 24 hours.
            </p>
          </div>
          <div className="bg-dime-purple/5 p-4 rounded-lg border border-dime-purple/10">
            <p className="text-sm text-slate-700">
              <strong>Next:</strong> Add your debt information and connect your bank to begin your debt-free journey
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-slate-900">
                {currentStepData.title}
              </CardTitle>
              <button 
                onClick={onComplete}
                className="text-slate-400 hover:text-slate-600 text-sm"
                data-testid="button-skip-onboarding"
              >
                Skip
              </button>
            </div>
            <p className="text-slate-600">{currentStepData.subtitle}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Step {currentStep + 1} of {steps.length}</span>
                <span className="text-slate-500">{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStepData.content}
          
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              data-testid="button-previous-step"
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              className="bg-dime-purple hover:bg-dime-purple/90"
              data-testid={currentStep === steps.length - 1 ? "button-start-journey" : "button-next-step"}
            >
              {currentStep === steps.length - 1 ? "Start My Journey" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}