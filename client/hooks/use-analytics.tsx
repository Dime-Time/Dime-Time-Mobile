import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { trackPageView, trackEngagement } from '../lib/analytics';

export const useAnalytics = () => {
  const [location] = useLocation();
  const prevLocationRef = useRef<string>(location);
  const sessionStartRef = useRef<number>(Date.now());
  const pageStartRef = useRef<number>(Date.now());
  
  useEffect(() => {
    // Track page views when routes change
    if (location !== prevLocationRef.current) {
      // Track time spent on previous page
      if (prevLocationRef.current) {
        const timeSpent = Date.now() - pageStartRef.current;
        trackEngagement('page_time', Math.round(timeSpent / 1000));
      }
      
      // Track new page view
      trackPageView(location);
      
      // Update refs
      prevLocationRef.current = location;
      pageStartRef.current = Date.now();
    }
  }, [location]);

  // Track session duration on unmount
  useEffect(() => {
    return () => {
      const sessionDuration = Date.now() - sessionStartRef.current;
      trackEngagement('session_duration', Math.round(sessionDuration / 1000));
    };
  }, []);

  // Track specific page interactions
  const trackPageInteraction = (action: string, element?: string) => {
    trackEngagement(`${location}_${action}`, element ? 1 : undefined);
  };

  return { trackPageInteraction };
};