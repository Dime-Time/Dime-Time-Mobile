import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Zap,
  Trophy,
  ArrowUp,
  ArrowRight
} from "lucide-react";

export default function BusinessAnalytics() {
  return (
    <div className="min-h-screen p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Business Analytics & Forecasting</h1>
            <p className="text-slate-600">Market analysis, revenue projections, and growth strategy for Dime Time</p>
          </div>
          <Badge variant="secondary" className="bg-dime-purple/10 text-dime-purple border-dime-purple/20">
            Strategic Analysis
          </Badge>
        </div>

        {/* Revenue Model Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Revenue Model
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-dime-accent/10 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-1">Subscription Revenue</h3>
                  <p className="text-2xl font-bold text-dime-accent">$35.88</p>
                  <p className="text-sm text-slate-600">per user/year</p>
                </div>
                <div className="p-4 bg-dime-purple/10 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-1">Interest Revenue</h3>
                  <p className="text-2xl font-bold text-dime-purple">$52.00</p>
                  <p className="text-sm text-slate-600">per user/year (4% APY)</p>
                </div>
              </div>
              <div className="p-4 bg-dime-lilac/10 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-1">Total Revenue Per User</h3>
                <p className="text-3xl font-bold text-dime-lilac">$87.88</p>
                <p className="text-sm text-slate-600">annual recurring revenue</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-dime-purple" />
                Market Size
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Americans with Debt</p>
                <p className="text-2xl font-bold text-slate-900">77M</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Avg Debt Per Person</p>
                <p className="text-xl font-semibold text-slate-900">$6,200</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Target Market</p>
                <p className="text-xl font-semibold text-dime-purple">20-40M</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Competitive Edge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Our APY</span>
                <span className="font-bold text-dime-accent">4.0%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Competitors</span>
                <span className="font-medium text-red-600">0.1%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Our Price</span>
                <span className="font-bold text-dime-accent">$2.99/mo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Competitors</span>
                <span className="font-medium text-red-600">$5-10/mo</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Growth Projections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-dime-purple" />
              3-Year Growth Projection to $100M Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-dime-purple/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-dime-purple" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Year 1: Foundation</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-dime-purple">50K</p>
                  <p className="text-sm text-slate-600">users</p>
                  <p className="text-xl font-semibold text-slate-900">$4.4M</p>
                  <p className="text-sm text-slate-600">revenue</p>
                </div>
                <div className="mt-4 text-sm text-slate-600">
                  Launch, early adopters, product refinement
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-dime-accent/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-dime-accent" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Year 2: Scale</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-dime-accent">400K</p>
                  <p className="text-sm text-slate-600">users</p>
                  <p className="text-xl font-semibold text-slate-900">$35M</p>
                  <p className="text-sm text-slate-600">revenue</p>
                </div>
                <div className="mt-4 text-sm text-slate-600">
                  Aggressive marketing, geographic expansion
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-dime-lilac/10 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-dime-lilac" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Year 3: Dominance</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-dime-lilac">1.14M</p>
                  <p className="text-sm text-slate-600">users</p>
                  <p className="text-xl font-semibold text-slate-900">$100M</p>
                  <p className="text-sm text-slate-600">revenue target</p>
                </div>
                <div className="mt-4 text-sm text-slate-600">
                  National coverage, enterprise partnerships
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-dime-purple/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUp className="w-4 h-4 text-dime-purple" />
                <span className="font-semibold text-slate-900">Required Growth Rate</span>
              </div>
              <p className="text-2xl font-bold text-dime-purple">31,667</p>
              <p className="text-sm text-slate-600">new users per month average</p>
            </div>
          </CardContent>
        </Card>

        {/* Profit Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-green-500" />
                Profit Margins at 1M Users
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Gross Revenue</span>
                  <span className="text-xl font-bold text-dime-accent">$87.88M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Operating Costs</span>
                  <span className="text-xl font-semibold text-red-600">$13.7M</span>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Net Profit</span>
                    <span className="text-2xl font-bold text-dime-accent">$74.18M</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-dime-accent/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Profit Margin</span>
                  <span className="text-3xl font-bold text-dime-accent">84%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-dime-purple" />
                Competitive Benchmarks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Round-up App Success</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Acorns</span>
                    <span className="font-medium text-slate-900">10M+ users</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Qapital</span>
                    <span className="font-medium text-slate-900">6M+ users</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Digit</span>
                    <span className="font-medium text-slate-900">7M+ users</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Direct Competitors</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tally (shutdown)</span>
                    <span className="font-medium text-slate-900">500K users</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">PocketGuard</span>
                    <span className="font-medium text-slate-900">3M users</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Marketing Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              TikTok Marketing Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Campaign Concept</h4>
                <div className="p-4 bg-dime-lilac/10 rounded-lg mb-4">
                  <p className="text-slate-900 font-medium">"AI-generated animals holding phones saying 'Get out of debt one dime at a time with Dime Time' + App Store download button"</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-slate-900 mb-1">Why This Works:</h5>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• AI animals trending on TikTok (high shareability)</li>
                      <li>• Simple, memorable hook: "One dime at a time"</li>
                      <li>• Direct CTA removes all friction</li>
                      <li>• Target audience (18-35) has highest debt rates</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Expected Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Conversion Rate</span>
                    <span className="font-medium text-slate-900">2-5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Cost Per User</span>
                    <span className="font-medium text-dime-accent">$2-10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Viral Potential</span>
                    <span className="font-medium text-dime-purple">10M+ views</span>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-dime-purple/10 rounded-lg">
                  <h5 className="font-semibold text-slate-900 mb-1">Q1 Projection</h5>
                  <p className="text-2xl font-bold text-dime-purple">50K+</p>
                  <p className="text-sm text-slate-600">users from TikTok campaign</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Success Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-dime-purple" />
              Key Success Metrics & Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-dime-purple/10 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-1">User Acquisition Cost</h4>
                <p className="text-xl font-bold text-dime-purple">&lt; $25</p>
                <p className="text-sm text-slate-600">per user target</p>
              </div>
              
              <div className="p-4 bg-dime-accent/10 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-1">Retention Rate</h4>
                <p className="text-xl font-bold text-dime-accent">85%+</p>
                <p className="text-sm text-slate-600">monthly retention</p>
              </div>
              
              <div className="p-4 bg-dime-lilac/10 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-1">Funding Needed</h4>
                <p className="text-xl font-bold text-dime-lilac">$15-25M</p>
                <p className="text-sm text-slate-600">3-year growth plan</p>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-1">Team Scale</h4>
                <p className="text-xl font-bold text-slate-900">50+</p>
                <p className="text-sm text-slate-600">employees by Year 2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-dime-purple" />
              Immediate Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-100 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-slate-900">Axos Bank Setup (Tuesday)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-dime-purple/10 rounded-lg">
                  <div className="w-2 h-2 bg-dime-purple rounded-full"></div>
                  <span className="font-medium text-slate-900">Apple Developer Account ($99)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-dime-accent/10 rounded-lg">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <span className="font-medium text-slate-900">AI Animal Video Creation</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-dime-lilac/10 rounded-lg">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <span className="font-medium text-slate-900">Series A Pitch Deck ($15-25M)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <span className="font-medium text-slate-900">Team Building & Hiring</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <span className="font-medium text-slate-900">Marketing Campaign Launch</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}