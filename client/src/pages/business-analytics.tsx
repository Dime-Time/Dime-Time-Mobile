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
  ArrowRight,
  CreditCard
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

        {/* Phase 2: Debt Consolidation Expansion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-dime-purple" />
              Phase 2: Debt Consolidation Lending (Year 2-3)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Market Opportunity */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Market Opportunity</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-dime-accent/10 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Target Market</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• 24.6M Americans with personal loans</li>
                      <li>• $1T+ credit card debt at 20-30% APR</li>
                      <li>• 48.7% of loans are for debt consolidation</li>
                      <li>• Average consolidation: $15,000</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-dime-purple/10 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Competitive Advantage</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• 10% APR vs 15.95-23.43% competitors</li>
                      <li>• Push notification targeting</li>
                      <li>• Existing user trust & data</li>
                      <li>• Integrated debt reduction platform</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Revenue Model</h4>
                    <p className="text-sm text-slate-600 mb-2">
                      Interest rate arbitrage: Borrow at 5%, lend at 10%
                    </p>
                    <div className="text-xs text-slate-500">
                      Example: $750M loan portfolio = $37.5M annual profit
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Revenue Projections */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Projections</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-900">Year 2: Pilot</span>
                      <span className="text-sm text-green-600 font-medium">10K Users</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Loan Portfolio</p>
                        <p className="font-bold text-slate-900">$150M</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Annual Profit</p>
                        <p className="font-bold text-green-600">$7.5M</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-900">Year 3: Scale</span>
                      <span className="text-sm text-blue-600 font-medium">50K Users</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Loan Portfolio</p>
                        <p className="font-bold text-slate-900">$750M</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Annual Profit</p>
                        <p className="font-bold text-blue-600">$37.5M</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-dime-purple/10 rounded-lg border border-dime-purple/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-900">Year 4: National</span>
                      <span className="text-sm text-dime-purple font-medium">100K Users</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Loan Portfolio</p>
                        <p className="font-bold text-slate-900">$1.5B</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Annual Profit</p>
                        <p className="font-bold text-dime-purple">$75M</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-slate-900 mb-2">⚠️ Implementation Requirements</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-slate-900">Regulatory</p>
                  <ul className="text-slate-600 mt-1 space-y-1">
                    <li>• Consumer lending licenses (40+ states)</li>
                    <li>• 6-12 month approval process</li>
                    <li>• $500K-1M compliance setup</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Capital</p>
                  <ul className="text-slate-600 mt-1 space-y-1">
                    <li>• $10-50M initial lending capital</li>
                    <li>• Bank partnership for funding</li>
                    <li>• Securitization for growth</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Timeline</p>
                  <ul className="text-slate-600 mt-1 space-y-1">
                    <li>• Year 2: Licensing & pilot launch</li>
                    <li>• Year 3: Multi-state expansion</li>
                    <li>• Year 4: National rollout</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Store Launch Timeline Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-dime-purple" />
              App Store Launch Timeline - Two Approaches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Fast Track Approach */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-dime-accent/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-dime-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Fast Track: Individual Account</h3>
                  <Badge variant="secondary" className="bg-dime-accent/10 text-dime-accent border-dime-accent/20">
                    Recommended
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 bg-dime-accent/5 rounded-lg border-l-4 border-dime-accent">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900">Week 1 (This Week)</span>
                      <span className="text-sm text-dime-accent font-medium">$99</span>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Apply for Individual Developer Account</li>
                      <li>• Axos Bank setup call (Tuesday)</li>
                      <li>• Start AI animal video creation</li>
                      <li>• Finalize legal agreements and user flow</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900">Week 2-3</span>
                      <span className="text-sm text-slate-600">Setup</span>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Account approved within 24-48 hours</li>
                      <li>• Upload app with legal compliance</li>
                      <li>• Submit for TestFlight beta testing</li>
                      <li>• Test user agreement flow</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-dime-purple/5 rounded-lg border-l-4 border-dime-purple">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900">Week 4 (Launch)</span>
                      <span className="text-sm text-dime-purple font-medium">Go Live</span>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• App Store review (2-7 days)</li>
                      <li>• Launch TikTok marketing campaign</li>
                      <li>• Begin user acquisition</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-dime-lilac/10 rounded-lg">
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">Pros</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>✓ Fastest path to market (4 weeks)</li>
                      <li>✓ No DUNS number required</li>
                      <li>✓ Immediate beta testing capability</li>
                      <li>✓ Can start marketing immediately</li>
                    </ul>
                    <h4 className="font-semibold text-slate-900 text-sm mb-1 mt-2">Cons</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Shows personal name instead of "Dime Time"</li>
                      <li>• Need to transfer later to business account</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Business Account Approach */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-dime-purple/10 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-dime-purple" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Business Account Path</h3>
                  <Badge variant="outline" className="border-slate-300 text-slate-600">
                    Longer Term
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900">Month 1-2</span>
                      <span className="text-sm text-yellow-600 font-medium">DUNS Fix</span>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Contact Dun & Bradstreet for appeal</li>
                      <li>• Gather additional business documentation</li>
                      <li>• Establish trade references</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900">Month 3-6</span>
                      <span className="text-sm text-slate-600">Credit Building</span>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Build business credit history</li>
                      <li>• Wait for DUNS reapproval</li>
                      <li>• Continue operating on individual account</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-dime-purple/5 rounded-lg border-l-4 border-dime-purple">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900">Month 6+ (Transfer)</span>
                      <span className="text-sm text-dime-purple font-medium">$299</span>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Apply for Business Developer Account</li>
                      <li>• Transfer app to business account</li>
                      <li>• Rebrand as "Dime Time" company</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">Pros</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>✓ Professional business branding</li>
                      <li>✓ Corporate developer benefits</li>
                      <li>✓ Better for investor presentations</li>
                    </ul>
                    <h4 className="font-semibold text-slate-900 text-sm mb-1 mt-2">Cons</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• 6+ month delay to launch</li>
                      <li>• DUNS approval uncertainty</li>
                      <li>• Missed early market opportunity</li>
                      <li>• Higher cost ($299 vs $99)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-dime-accent/10 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">💡 Recommended Strategy</h4>
              <p className="text-slate-600 mb-3">
                Start with <strong>Individual Account</strong> to launch quickly, then upgrade to Business Account once DUNS issues are resolved. This hybrid approach gets you to market fast while building toward professional branding.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-lg font-bold text-dime-accent">4 weeks</p>
                  <p className="text-sm text-slate-600">to App Store launch</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-lg font-bold text-dime-purple">6-12 months</p>
                  <p className="text-sm text-slate-600">to business rebrand</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-lg font-bold text-slate-900">$0</p>
                  <p className="text-sm text-slate-600">revenue lost waiting</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}