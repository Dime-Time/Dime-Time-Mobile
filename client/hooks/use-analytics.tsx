import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { trackPageView, trackEngagement, trackScrollDepth } from '../lib/analytics';

export const useAnalytics = () => {
  const [location] = useLocation();
  const prevLocationRef = useRef<string>('');
  const sessionStartRef = useRef<number>(Date.now());
  const pageStartRef = useRef<number>(Date.now());
  const initialPageTrackedRef = useRef<boolean>(false);
  
  // Create better page titles for analytics
  const getPageTitle = (path: string) => {
    const titles: { [key: string]: string } = {
      '/': 'Dashboard - Dime Time',
      '/transactions': 'Transactions - Dime Time',
      '/debts': 'Debt Management - Dime Time',
      '/crypto': 'Crypto Investments - Dime Time',
      '/insights': 'Financial Insights - Dime Time',
      '/banking': 'Banking - Dime Time',
      '/qr': 'QR Code - Dime Time',
      '/settings': 'Settings - Dime Time',
      '/notifications': 'Notifications - Dime Time',
      '/legal': 'Legal - Dime Time',
      '/signup': 'Sign Up - Dime Time',
      '/dime-token': 'Dime Token - Dime Time',
      '/business-analytics': 'Business Analytics - Dime Time'
    };
    return titles[path] || `${path} - Dime Time`;
  };
  
  useEffect(() => {
    // Track initial page view on mount
    if (!initialPageTrackedRef.current) {
      trackPageView(location, getPageTitle(location));
      prevLocationRef.current = location;
      initialPageTrackedRef.current = true;
      return;
    }
    
    // Track page views when routes change
    if (location !== prevLocationRef.current) {
      // Track time spent on previous page (in milliseconds)
      if (prevLocationRef.current) {
        const timeSpent = Date.now() - pageStartRef.current;
        trackEngagement('page_time', timeSpent, prevLocationRef.current);
      }
      
      // Track new page view with proper title
      trackPageView(location, getPageTitle(location));
      
      // Update refs
      prevLocationRef.current = location;
      pageStartRef.current = Date.now();
    }
  }, [location]);

  // Track session duration on unmount (in milliseconds)
  useEffect(() => {
    return () => {
      const sessionDuration = Date.now() - sessionStartRef.current;
      trackEngagement('session_duration', sessionDuration);
    };
  }, []);

  // Track specific page interactions
  const trackPageInteraction = (action: string, element?: string) => {
    trackEngagement(`${location}_${action}`, element ? 1 : undefined);
  };

  return { trackPageInteraction };
};