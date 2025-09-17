import appIcon from "@assets/app-icon.png";
import { useEffect } from "react";
import { trackEvent, trackUserMilestone } from "../../lib/analytics";

export default function Landing() {
  useEffect(() => {
    // Track landing page visit
    trackEvent('page_view', 'website', 'landing_page');
    trackUserMilestone('website_visit');
    
    // Track time spent on landing page
    const startTime = Date.now();
    
    return () => {
      const timeSpent = Date.now() - startTime;
      trackEvent('engagement', 'website', 'landing_time_spent', Math.round(timeSpent / 1000));
    };
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#918EF4' }}>
      <div className="text-center px-8">
        {/* Logo */}
        <div className="mb-12">
          <img 
            src={appIcon} 
            alt="Dime Time Logo" 
            className="w-32 h-32 mx-auto mb-8 logo-image-clean"
          />
        </div>
        
        {/* Main Message */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
          Get out of debt, one dime at a time with Dime Time.
        </h1>
        
        {/* Coming Soon */}
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-8">
          Coming soon!
        </h2>
        
        {/* Call to Action Buttons */}
        <div className="space-y-4">
          <button 
            onClick={() => {
              trackEvent('engagement', 'website', 'notify_me_clicked');
              trackUserMilestone('interest_expressed');
              alert('Thanks for your interest! We\'ll notify you when Dime Time launches.');
            }}
            className="bg-white text-purple-600 font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors mx-4"
          >
            Notify Me When It Launches
          </button>
          
          <div className="text-white text-lg">
            <p className="mb-2">🎯 Turn spare change into debt freedom</p>
            <p className="mb-2">💰 Automated round-up investments</p>
            <p>📱 Coming to iOS App Store soon</p>
          </div>
        </div>
        
        {/* Website Analytics Tracking */}
        <div className="mt-12 text-white/70 text-sm">
          <p>Visit count tracked for launch insights</p>
        </div>
      </div>
    </div>
  );
}