import { storage } from "../storage";
import { InsertNotification } from "../../shared/schema";

interface NotificationTemplate {
  title: string;
  message: string;
  type: string;
  channel: 'push' | 'email' | 'sms';
  priority: 'low' | 'medium' | 'high';
}

export class NotificationService {
  private webPushSubscriptions = new Map<string, any>(); // Store push subscriptions

  async sendNotification(userId: string, template: NotificationTemplate, metadata?: any) {
    try {
      // Get user notification settings
      const settings = await storage.getNotificationSettings(userId);
      
      if (!settings) {
        console.log(`No notification settings found for user ${userId}`);
        return;
      }

      // Check if push notifications are enabled
      if (template.channel === 'push' && !settings.pushEnabled) {
        console.log(`Push notifications disabled for user ${userId}`);
        return;
      }

      // Create notification record
      const notification: InsertNotification = {
        userId,
        type: template.type,
        channel: template.channel,
        title: template.title,
        message: template.message,
        recipient: userId, // For push notifications, recipient is the user ID
        priority: template.priority,
        metadata: metadata ? JSON.stringify(metadata) : null,
      };

      const createdNotification = await storage.createNotification(notification);

      // Send push notification if it's a push type
      if (template.channel === 'push') {
        await this.sendPushNotification(userId, template);
      }

      return createdNotification;
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  private async sendPushNotification(userId: string, template: NotificationTemplate) {
    try {
      // For web browsers
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(template.title, {
            body: template.message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: template.type,
            requireInteraction: template.priority === 'high',
          });
        }
      }

      // For mobile apps (Capacitor) - only when actually in mobile environment
      if (typeof window !== 'undefined' && (window as any).Capacitor && (window as any).Capacitor.isNative) {
        try {
          // Only attempt to load Capacitor plugins in native environment
          console.log('Sending notification via Capacitor:', template.title);
          // Capacitor integration will be handled by the mobile app build
        } catch (error) {
          console.log('Capacitor LocalNotifications not available:', error);
        }
      }

      console.log(`Push notification sent to user ${userId}: ${template.title}`);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  // Notification templates for different events
  async sendRoundUpNotification(userId: string, amount: string, merchant: string) {
    const template: NotificationTemplate = {
      title: "Round-up Collected! 💰",
      message: `+$${amount} from ${merchant} → Moving you closer to debt freedom!`,
      type: "roundup",
      channel: "push",
      priority: "medium"
    };

    return this.sendNotification(userId, template, { amount, merchant });
  }

  async sendPaymentDueNotification(userId: string, debtName: string, amount: string, daysUntilDue: number) {
    const urgency = daysUntilDue <= 2 ? "🚨" : daysUntilDue <= 7 ? "⏰" : "📅";
    const template: NotificationTemplate = {
      title: `${urgency} Payment Due ${daysUntilDue === 1 ? 'Tomorrow' : `in ${daysUntilDue} days`}`,
      message: `${debtName}: $${amount} payment due ${daysUntilDue === 1 ? 'tomorrow' : `in ${daysUntilDue} days`}`,
      type: "payment",
      channel: "push",
      priority: daysUntilDue <= 2 ? "high" : "medium"
    };

    return this.sendNotification(userId, template, { debtName, amount, daysUntilDue });
  }

  async sendMilestoneNotification(userId: string, milestone: string, progress: number) {
    const template: NotificationTemplate = {
      title: "🎉 Milestone Achieved!",
      message: `${milestone} You're ${progress}% closer to being debt-free!`,
      type: "milestone",
      channel: "push",
      priority: "high"
    };

    return this.sendNotification(userId, template, { milestone, progress });
  }

  async sendWeeklyReportNotification(userId: string, weeklyRoundUps: string, totalSaved: string, monthsReduced: number) {
    const template: NotificationTemplate = {
      title: "📊 Weekly Progress Report",
      message: `This week: $${weeklyRoundUps} in round-ups! Total saved: $${totalSaved} (${monthsReduced} months faster to debt-free)`,
      type: "weekly_report",
      channel: "push",
      priority: "medium"
    };

    return this.sendNotification(userId, template, { weeklyRoundUps, totalSaved, monthsReduced });
  }

  async sendCryptoUpdateNotification(userId: string, cryptoAmount: string, currentValue: string, gains: string) {
    const template: NotificationTemplate = {
      title: "₿ Crypto Update",
      message: `Your $${cryptoAmount} Bitcoin investment is now worth $${currentValue} (+$${gains})`,
      type: "crypto",
      channel: "push",
      priority: "low"
    };

    return this.sendNotification(userId, template, { cryptoAmount, currentValue, gains });
  }

  async sendDebtPaidOffNotification(userId: string, debtName: string, finalAmount: string) {
    const template: NotificationTemplate = {
      title: "🎊 DEBT PAID OFF! 🎊",
      message: `Congratulations! You've completely paid off your ${debtName} ($${finalAmount})! You're officially debt-free on this account!`,
      type: "debt_payoff",
      channel: "push",
      priority: "high"
    };

    return this.sendNotification(userId, template, { debtName, finalAmount });
  }

  async sendMotivationalNotification(userId: string, customMessage: string) {
    const messages = [
      "Every dollar counts! Your round-ups are building momentum 💪",
      "Small changes, big results! Keep up the great work 🌟",
      "You're closer to debt freedom than yesterday! 📈",
      "Your future self will thank you for today's progress 🙏",
      "Debt freedom isn't just a dream - you're making it reality! ✨"
    ];

    const message = customMessage || messages[Math.floor(Math.random() * messages.length)];

    const template: NotificationTemplate = {
      title: "💫 Daily Motivation",
      message,
      type: "motivation",
      channel: "push",
      priority: "low"
    };

    return this.sendNotification(userId, template, { customMessage: message });
  }

  // Advanced notification types for enhanced user engagement

  async sendDebtTimelineNotification(userId: string, monthsReduced: number, debtFreeDate: string) {
    const template: NotificationTemplate = {
      title: "🎯 Debt Freedom Timeline Update!",
      message: `Amazing! You're now ${monthsReduced} months closer to debt-free. At this pace, you'll be free by ${debtFreeDate}! 🎉`,
      type: "debt_timeline",
      channel: "push",
      priority: "high"
    };

    return this.sendNotification(userId, template, { monthsReduced, debtFreeDate });
  }

  async sendInterestSavingsNotification(userId: string, amountSaved: string, realWorldComparison: string) {
    const template: NotificationTemplate = {
      title: "💰 Interest Savings Alert!",
      message: `Your round-ups saved you $${amountSaved} in credit card interest this month! That's equivalent to ${realWorldComparison} 🛒`,
      type: "interest_savings",
      channel: "push",
      priority: "high"
    };

    return this.sendNotification(userId, template, { amountSaved, realWorldComparison });
  }

  async sendCompetitiveSavingsNotification(userId: string, percentile: number, weeklyAmount: string) {
    const template: NotificationTemplate = {
      title: "🏆 You're Crushing It!",
      message: `You've saved more than ${percentile}% of Dime Time users this week! Your $${weeklyAmount} in round-ups is 2x the average user!`,
      type: "competitive_savings",
      channel: "push",
      priority: "medium"
    };

    return this.sendNotification(userId, template, { percentile, weeklyAmount });
  }

  async sendAxosEarningsNotification(userId: string, weeklyEarnings: string, totalEarnings: string, realWorldValue: string) {
    const template: NotificationTemplate = {
      title: "🏦 Your Money is Working!",
      message: `Your round-ups earned $${weeklyEarnings} this week at 4% APY! Total earned: $${totalEarnings} - that's a ${realWorldValue}! 🎬`,
      type: "axos_earnings",
      channel: "push",
      priority: "medium"
    };

    return this.sendNotification(userId, template, { weeklyEarnings, totalEarnings, realWorldValue });
  }

  async sendGoalProgressNotification(userId: string, amountNeeded: string, goalType: string, progressPercent: number) {
    const urgency = progressPercent >= 90 ? "🔥" : progressPercent >= 75 ? "⚡" : "🎯";
    const template: NotificationTemplate = {
      title: `${urgency} Almost There!`,
      message: `You're just $${amountNeeded} away from your $${goalType} goal! You're ${progressPercent}% of the way there!`,
      type: "goal_progress",
      channel: "push",
      priority: "medium"
    };

    return this.sendNotification(userId, template, { amountNeeded, goalType, progressPercent });
  }

  async sendDebtAvalancheNotification(userId: string, recommendedDebt: string, potentialSavings: string) {
    const template: NotificationTemplate = {
      title: "💡 Smart Debt Strategy!",
      message: `Pay your ${recommendedDebt} next - it'll save you $${potentialSavings} vs your other debts! Smart move! 🧠`,
      type: "debt_avalanche",
      channel: "push",
      priority: "high"
    };

    return this.sendNotification(userId, template, { recommendedDebt, potentialSavings });
  }

  async sendDTTRewardsNotification(userId: string, tokensEarned: string, dollarValue: string, totalTokens: string) {
    const template: NotificationTemplate = {
      title: "🪙 DTT Rewards Earned!",
      message: `You earned ${tokensEarned} DTT tokens this week! Your DTT rewards are worth $${dollarValue} and growing 📈 (Total: ${totalTokens} DTT)`,
      type: "dtt_rewards",
      channel: "push",
      priority: "medium"
    };

    return this.sendNotification(userId, template, { tokensEarned, dollarValue, totalTokens });
  }

  async sendStreakMaintenanceNotification(userId: string, streakDays: number, nextAction: string) {
    const template: NotificationTemplate = {
      title: "🔥 Don't Break Your Streak!",
      message: `You're on a ${streakDays}-day round-up streak! ${nextAction} to keep the momentum going! 💪`,
      type: "streak_maintenance",
      channel: "push",
      priority: "high"
    };

    return this.sendNotification(userId, template, { streakDays, nextAction });
  }

  async sendMorningMotivationNotification(userId: string, dailyGoal: string, progressMessage: string) {
    const template: NotificationTemplate = {
      title: "☀️ Good Morning, Debt Crusher!",
      message: `Today's goal: $${dailyGoal} in round-ups toward freedom! ${progressMessage} 🌟`,
      type: "morning_motivation",
      channel: "push",
      priority: "low"
    };

    return this.sendNotification(userId, template, { dailyGoal, progressMessage });
  }

  async sendEveningCelebrationNotification(userId: string, dailyAmount: string, encouragementMessage: string) {
    const template: NotificationTemplate = {
      title: "🌙 Great Job Today!",
      message: `You collected $${dailyAmount} today! ${encouragementMessage} Sweet dreams of debt freedom! ✨`,
      type: "evening_celebration",
      channel: "push",
      priority: "low"
    };

    return this.sendNotification(userId, template, { dailyAmount, encouragementMessage });
  }

  async sendPremiumTeaserNotification(userId: string, featureName: string, potentialSavings: string) {
    const template: NotificationTemplate = {
      title: "💎 Unlock Premium Savings!",
      message: `${featureName} could save you $${potentialSavings}/month! Upgrade to explore premium debt optimization 🚀`,
      type: "premium_teaser",
      channel: "push",
      priority: "low"
    };

    return this.sendNotification(userId, template, { featureName, potentialSavings });
  }

  async sendSeasonalNotification(userId: string, occasion: string, tip: string) {
    const template: NotificationTemplate = {
      title: `🎊 ${occasion} Savings Tip!`,
      message: tip,
      type: "seasonal",
      channel: "push",
      priority: "medium"
    };

    return this.sendNotification(userId, template, { occasion, tip });
  }

  async sendWeeklyChallengeNotification(userId: string, challengeGoal: string, bonusReward: string) {
    const template: NotificationTemplate = {
      title: "🏁 Weekly Challenge!",
      message: `This week's challenge: ${challengeGoal} for ${bonusReward}! Are you up for it? 💪`,
      type: "weekly_challenge",
      channel: "push",
      priority: "medium"
    };

    return this.sendNotification(userId, template, { challengeGoal, bonusReward });
  }

  // Get user's notification history
  async getUserNotifications(userId: string, limit: number = 20) {
    return storage.getUserNotifications(userId, limit);
  }

  // Mark notification as delivered
  async markAsDelivered(notificationId: string) {
    return storage.updateNotificationStatus(notificationId, 'delivered');
  }

  // Mark notification as read
  async markAsRead(notificationId: string) {
    return storage.updateNotificationStatus(notificationId, 'read');
  }
}

export const notificationService = new NotificationService();