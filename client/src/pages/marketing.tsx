import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Download, Share2, Eye } from "lucide-react";
import { LogoWithText } from "@/components/logo";
import marketingHeroImage from "@assets/48615C93-5C3F-4147-8D8E-2D3E8F5C8B67_1755699806741.png";

export default function Marketing() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--dime-background)' }}>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-white mb-12">
            Dime Time Marketing Campaign
          </h1>
          
          {/* Hero Marketing Asset */}
          <Card className="mb-12" style={{ backgroundColor: 'var(--dime-background)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">
                Professional Marketing Hero
              </CardTitle>
              <p className="text-white text-center">
                Two professional lion characters representing financial expertise and trust
              </p>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <div className="relative max-w-xl mx-auto">
                  <img 
                    src={marketingHeroImage} 
                    alt="Dime Time Marketing - Professional Lions" 
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                  {/* Logo Overlay */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-2">
                    <LogoWithText size={100} />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="text-white border border-white hover:bg-white hover:text-black"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Asset
                </Button>
                <Button 
                  className="text-white border border-white hover:bg-white hover:text-black"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Campaign
                </Button>
                <Button 
                  className="text-white border border-white hover:bg-white hover:text-black"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card style={{ backgroundColor: 'var(--dime-background)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <CardHeader>
                <CardTitle className="text-xl text-white">Campaign Concept</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-white space-y-2">
                  <li>• Professional lion mascots representing financial wisdom</li>
                  <li>• Lavender background matching brand identity</li>
                  <li>• Modern business attire suggesting trustworthiness</li>
                  <li>• Mobile devices showing tech-forward approach</li>
                  <li>• Official Dime Time logo prominently featured</li>
                </ul>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: 'var(--dime-background)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <CardHeader>
                <CardTitle className="text-xl text-white">Usage Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-white space-y-2">
                  <li>• App Store screenshots and listings</li>
                  <li>• Social media marketing campaigns</li>
                  <li>• Website hero sections and banners</li>
                  <li>• Investor presentation materials</li>
                  <li>• Partnership and business proposals</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}