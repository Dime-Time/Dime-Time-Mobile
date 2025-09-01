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
            <h1 className="text-3xl font-bold text-white mb-2">Business Analytics & Forecasting</h1>
            <p className="text-white/80">Market analysis, revenue projections, and growth strategy for Dime Time</p>
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
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <h3 className="font-semibold text-white mb-1">Subscription Revenue</h3>
                  <p className="text-2xl font-bold text-green-500">$35.88</p>
                  <p className="text-sm text-white/60">per user/year</p>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h3 className="font-semibold text-white mb-1">Interest Revenue</h3>
                  <p className="text-2xl font-bold text-blue-500">$52.00</p>
                  <p className="text-sm text-white/60">per user/year (4% APY)</p>
                </div>
              </div>
              <div className="p-4 bg-dime-purple/10 rounded-lg border border-dime-purple/20">
                <h3 className="font-semibold text-white mb-1">Total Revenue Per User</h3>
                <p className="text-3xl font-bold text-dime-purple">$87.88</p>
                <p className="text-sm text-white/60">annual recurring revenue</p>
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
                <p className="text-sm text-white/60">Americans with Debt</p>
                <p className="text-2xl font-bold text-white">77M</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Avg Debt Per Person</p>
                <p className="text-xl font-semibold text-white">$6,200</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Target Market</p>
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
                <span className="text-sm text-white/60">Our APY</span>
                <span className="font-bold text-green-500">4.0%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Competitors</span>
                <span className="font-medium text-red-400">0.1%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Our Price</span>
                <span className="font-bold text-green-500">$2.99/mo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Competitors</span>
                <span className="font-medium text-red-400">$5-10/mo</span>
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
              <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-white">Year 1: Foundation</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-blue-500">50K</p>
                  <p className="text-sm text-white/60">users</p>
                  <p className="text-xl font-semibold text-white">$4.4M</p>
                  <p className="text-sm text-white/60">revenue</p>
                </div>
                <div className="mt-4 text-sm text-white/80">
                  Launch, early adopters, product refinement
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold text-white">Year 2: Scale</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-purple-500">400K</p>
                  <p className="text-sm text-white/60">users</p>
                  <p className="text-xl font-semibold text-white">$35M</p>
                  <p className="text-sm text-white/60">revenue</p>
                </div>
                <div className="mt-4 text-sm text-white/80">
                  Aggressive marketing, geographic expansion
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold text-white">Year 3: Dominance</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-green-500">1.14M</p>
                  <p className="text-sm text-white/60">users</p>
                  <p className="text-xl font-semibold text-white">$100M</p>
                  <p className="text-sm text-white/60">revenue target</p>
                </div>
                <div className="mt-4 text-sm text-white/80">
                  National coverage, enterprise partnerships
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-dime-purple/10 rounded-lg border border-dime-purple/20">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUp className="w-4 h-4 text-dime-purple" />
                <span className="font-semibold text-white">Required Growth Rate</span>
              </div>
              <p className="text-2xl font-bold text-dime-purple">31,667</p>
              <p className="text-sm text-white/60">new users per month average</p>
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
                  <span className="text-white/60">Gross Revenue</span>
                  <span className="text-xl font-bold text-green-500">$87.88M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Operating Costs</span>
                  <span className="text-xl font-semibold text-red-400">$13.7M</span>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">Net Profit</span>
                    <span className="text-2xl font-bold text-green-500">$74.18M</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Profit Margin</span>
                  <span className="text-3xl font-bold text-green-500">84%</span>
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
                <h4 className="font-semibold text-white mb-3">Round-up App Success</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">Acorns</span>
                    <span className="font-medium text-white">10M+ users</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Qapital</span>
                    <span className="font-medium text-white">6M+ users</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Digit</span>
                    <span className="font-medium text-white">7M+ users</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">Direct Competitors</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">Tally (shutdown)</span>
                    <span className="font-medium text-white">500K users</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">PocketGuard</span>
                    <span className="font-medium text-white">3M users</span>
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
                <h4 className="font-semibold text-white mb-3">Campaign Concept</h4>
                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 mb-4">
                  <p className="text-white font-medium">"AI-generated animals holding phones saying 'Get out of debt one dime at a time with Dime Time' + App Store download button"</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-white mb-1">Why This Works:</h5>
                    <ul className="text-sm text-white/80 space-y-1">
                      <li>• AI animals trending on TikTok (high shareability)</li>
                      <li>• Simple, memorable hook: "One dime at a time"</li>
                      <li>• Direct CTA removes all friction</li>
                      <li>• Target audience (18-35) has highest debt rates</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">Expected Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60">Conversion Rate</span>
                    <span className="font-medium text-white">2-5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Cost Per User</span>
                    <span className="font-medium text-green-500">$2-10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Viral Potential</span>
                    <span className="font-medium text-yellow-500">10M+ views</span>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-dime-purple/10 rounded-lg border border-dime-purple/20">
                  <h5 className="font-semibold text-white mb-1">Q1 Projection</h5>
                  <p className="text-2xl font-bold text-dime-purple">50K+</p>
                  <p className="text-sm text-white/60">users from TikTok campaign</p>
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
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h4 className="font-semibold text-white mb-1">User Acquisition Cost</h4>
                <p className="text-xl font-bold text-blue-500">&lt; $25</p>
                <p className="text-sm text-white/60">per user target</p>
              </div>
              
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <h4 className="font-semibold text-white mb-1">Retention Rate</h4>
                <p className="text-xl font-bold text-green-500">85%+</p>
                <p className="text-sm text-white/60">monthly retention</p>
              </div>
              
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <h4 className="font-semibold text-white mb-1">Funding Needed</h4>
                <p className="text-xl font-bold text-purple-500">$15-25M</p>
                <p className="text-sm text-white/60">3-year growth plan</p>
              </div>
              
              <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <h4 className="font-semibold text-white mb-1">Team Scale</h4>
                <p className="text-xl font-bold text-orange-500">50+</p>
                <p className="text-sm text-white/60">employees by Year 2</p>
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
                <div className="flex items-center gap-3 p-3 bg-dime-purple/10 rounded-lg border border-dime-purple/20">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-white">Axos Bank Setup (Tuesday)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-white">Apple Developer Account ($99)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="font-medium text-white">AI Animal Video Creation</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="font-medium text-white">Series A Pitch Deck ($15-25M)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="font-medium text-white">Team Building & Hiring</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="font-medium text-white">Marketing Campaign Launch</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}