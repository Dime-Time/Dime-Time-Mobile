// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Your Google Analytics Measurement ID
const MEASUREMENT_ID = 'G-DSY7SSH1VG';

// Initialize Google Analytics
export const initGA = () => {
  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${MEASUREMENT_ID}');
  `;
  document.head.appendChild(script2);
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('config', MEASUREMENT_ID, {
    page_path: url
  });
};

// Track events
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// ===== FINTECH-SPECIFIC ANALYTICS =====

// Round-up transaction tracking
export const trackRoundUp = (amount: number, transactionId?: string) => {
  trackEvent('roundup_transaction', 'finance', transactionId, Math.round(amount * 100));
  
  // Track milestone achievements
  if (amount >= 1.0) {
    trackEvent('roundup_milestone', 'finance', 'dollar_milestone', Math.round(amount * 100));
  }
};

// Debt payment tracking
export const trackDebtPayment = (amount: number, debtType: string, success: boolean) => {
  trackEvent('debt_payment', 'finance', debtType, Math.round(amount * 100));
  
  if (success) {
    trackEvent('payment_success', 'finance', debtType, Math.round(amount * 100));
  } else {
    trackEvent('payment_failed', 'finance', debtType);
  }
};

// Crypto investment tracking
export const trackCryptoInvestment = (amount: number, cryptoType: string = 'bitcoin') => {
  trackEvent('crypto_investment', 'finance', cryptoType, Math.round(amount * 100));
};

// Banking connection tracking
export const trackBankConnection = (success: boolean, bankName?: string) => {
  if (success) {
    trackEvent('bank_connected', 'finance', bankName);
  } else {
    trackEvent('bank_connection_failed', 'finance', bankName);
  }
};

// User journey milestones
export const trackUserMilestone = (milestone: string, value?: number) => {
  trackEvent('user_milestone', 'engagement', milestone, value);
};

// Feature usage tracking
export const trackFeatureUsage = (feature: string, action: string) => {
  trackEvent('feature_usage', 'engagement', `${feature}_${action}`);
};

// Financial goal tracking
export const trackGoalProgress = (goalType: string, progress: number, target: number) => {
  const progressPercent = Math.round((progress / target) * 100);
  trackEvent('goal_progress', 'finance', goalType, progressPercent);
  
  // Track goal completion
  if (progress >= target) {
    trackEvent('goal_completed', 'finance', goalType, Math.round(target * 100));
  }
};

// Performance and error tracking
export const trackError = (errorType: string, errorMessage: string) => {
  trackEvent('error', 'technical', errorType);
};

export const trackPerformance = (metric: string, value: number) => {
  trackEvent('performance', 'technical', metric, Math.round(value));
};

// Business intelligence tracking
export const trackRevenue = (amount: number, source: string) => {
  trackEvent('revenue', 'business', source, Math.round(amount * 100));
};

// User engagement tracking
export const trackEngagement = (action: string, duration?: number) => {
  trackEvent('engagement', 'user_behavior', action, duration);
};