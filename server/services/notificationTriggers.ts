import { notificationService } from "./notificationService";
import { debtCalculationService } from "./debtCalculationService";
import { storage } from "../storage";

export class NotificationTriggers {
  
  // Trigger when a new round-up is collected
  async onRoundUpCollected(userId: string, transactionId: string, roundUpAmount: number, merchantName: string) {
    try {
      // Send immediate notification for round-up
      await notificationService.sendRoundUpNotification(
        userId, 
        roundUpAmount.toFixed(2), 
        merchantName
      );

      // Check for milestone achievements
      await this.checkRoundUpMilestones(userId);

      // Check for debt timeline updates
      await this.checkDebtTimelineUpdates(userId);

      // Check for competitive savings notifications
      await this.checkCompetitiveSavings(userId);

    } catch (error) {
      console.error('Error triggering round-up notification:', error);
    }
  }

  // Trigger when a debt payment is processed
  async onDebtPaymentProcessed(userId: string, debtId: string, paymentAmount: number) {
    try {
      const debt = await storage.getDebt(debtId);
      if (!debt) return;

      // Calculate remaining balance
      const remainingBalance = parseFloat(debt.currentBalance) - paymentAmount;

      // Check if debt is fully paid off
      if (remainingBalance <= 0) {
        await notificationService.sendDebtPaidOffNotification(
          userId,
          debt.name,
          paymentAmount.toFixed(2)
        );
      } else {
        // Check for percentage milestones (25%, 50%, 75%, 90% paid off)
        const originalBalance = parseFloat(debt.originalBalance || debt.currentBalance);
        const percentPaidOff = ((originalBalance - remainingBalance) / originalBalance) * 100;
        
        const milestones = [25, 50, 75, 90];
        for (const milestone of milestones) {
          if (percentPaidOff >= milestone && percentPaidOff < milestone + 5) {
            await notificationService.sendMilestoneNotification(
              userId,
              `${milestone}% of ${debt.name} paid off!`,
              Math.round(percentPaidOff)
            );
            break;
          }
        }
      }

    } catch (error) {
      console.error('Error triggering debt payment notification:', error);
    }
  }

  // Check and trigger round-up milestone notifications
  private async checkRoundUpMilestones(userId: string) {
    try {
      const summary = await storage.getDashboardSummary(userId);
      const totalRoundUps = parseFloat(summary.totalRoundUps || '0');

      // Milestone checkpoints: $10, $25, $50, $100, $250, $500, $1000+
      const milestones = [10, 25, 50, 100, 250, 500, 1000];
      
      for (const milestone of milestones) {
        if (totalRoundUps >= milestone && totalRoundUps < milestone + 10) {
          await notificationService.sendMilestoneNotification(
            userId,
            `$${milestone} in total round-ups collected!`,
            Math.round((totalRoundUps / 2000) * 100) // Assume $2000 total debt goal
          );
          break;
        }
      }

    } catch (error) {
      console.error('Error checking round-up milestones:', error);
    }
  }

  // Check for upcoming payment due dates (daily job)
  async checkPaymentDueDates() {
    try {
      // Get all active debts
      const users = await storage.getAllUsers();
      
      for (const user of users) {
        const debts = await storage.getUserDebts(user.id);
        
        for (const debt of debts) {
          if (debt.dueDate) {
            const dueDate = new Date(debt.dueDate);
            const today = new Date();
            const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            // Send notifications 7, 3, and 1 days before due date
            if ([7, 3, 1].includes(daysUntilDue)) {
              await notificationService.sendPaymentDueNotification(
                user.id,
                debt.name,
                debt.minimumPayment || debt.currentBalance,
                daysUntilDue
              );
            }
          }
        }
      }

    } catch (error) {
      console.error('Error checking payment due dates:', error);
    }
  }

  // Send weekly progress reports (weekly job)
  async sendWeeklyReports() {
    try {
      const users = await storage.getAllUsers();
      
      for (const user of users) {
        // Check if user has weekly reports enabled
        const settings = await storage.getNotificationSettings(user.id);
        if (!settings?.weeklyReports) continue;

        // Calculate weekly round-ups (mock calculation for demo)
        const transactions = await storage.getUserTransactions(user.id);
        const lastWeekTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return transactionDate >= weekAgo;
        });

        const weeklyRoundUps = lastWeekTransactions.reduce((sum: number, t: any) => {
          return sum + (parseFloat(t.roundUpAmount || '0'));
        }, 0);

        if (weeklyRoundUps > 0) {
          const summary = await storage.getDashboardSummary(user.id);
          const totalSaved = summary.totalRoundUps || '0';
          
          await notificationService.sendWeeklyReportNotification(
            user.id,
            weeklyRoundUps.toFixed(2),
            totalSaved,
            Math.floor(Math.random() * 6) + 1 // Mock months reduced calculation
          );
        }
      }

    } catch (error) {
      console.error('Error sending weekly reports:', error);
    }
  }

  // Send daily motivational notifications
  async sendDailyMotivation() {
    try {
      const users = await storage.getAllUsers();
      
      for (const user of users) {
        // Check if user has marketing messages enabled (using as motivation opt-in)
        const settings = await storage.getNotificationSettings(user.id);
        if (!settings?.marketingMessages) continue;

        // Send motivational message
        await notificationService.sendMotivationalNotification(user.id, '');
      }

    } catch (error) {
      console.error('Error sending daily motivation:', error);
    }
  }

  // Trigger crypto investment notifications
  async onCryptoInvestment(userId: string, amount: number, cryptoSymbol: string) {
    try {
      // Get crypto purchases for user
      const purchases = await storage.getUserCryptoPurchases(userId);
      const totalInvested = purchases.reduce((sum: number, p: any) => sum + parseFloat(p.amountUsd), 0);

      // Mock current value calculation (in real app, get from API)
      const mockGains = totalInvested * 0.15; // 15% mock gains
      const currentValue = totalInvested + mockGains;

      await notificationService.sendCryptoUpdateNotification(
        userId,
        totalInvested.toFixed(2),
        currentValue.toFixed(2),
        mockGains.toFixed(2)
      );

    } catch (error) {
      console.error('Error triggering crypto notification:', error);
    }
  }

  // New advanced trigger methods

  // Check and send debt timeline updates
  private async checkDebtTimelineUpdates(userId: string) {
    try {
      const timeline = await debtCalculationService.calculateDebtFreeTimeline(userId);
      
      // Send timeline update if significant progress (every 2+ months reduced)
      if (timeline.monthsReduced >= 2) {
        await notificationService.sendDebtTimelineNotification(
          userId,
          timeline.monthsReduced,
          timeline.debtFreeDate
        );
      }
    } catch (error) {
      console.error('Error checking debt timeline updates:', error);
    }
  }

  // Check and send competitive savings notifications
  private async checkCompetitiveSavings(userId: string) {
    try {
      const userStats = await debtCalculationService.calculateUserPercentile(userId);
      
      // Send competitive notification if user is in top 75th percentile
      if (userStats.percentile >= 75) {
        await notificationService.sendCompetitiveSavingsNotification(
          userId,
          userStats.percentile,
          userStats.weeklyAmount.toFixed(2)
        );
      }
    } catch (error) {
      console.error('Error checking competitive savings:', error);
    }
  }

  // Check and send interest savings notifications
  private async checkInterestSavings(userId: string) {
    try {
      const savings = await debtCalculationService.calculateInterestSavings(userId);
      
      // Send interest savings notification if savings are significant (>$10/month)
      if (savings.monthlySavings >= 10) {
        await notificationService.sendInterestSavingsNotification(
          userId,
          savings.monthlySavings.toFixed(2),
          savings.realWorldComparison
        );
      }
    } catch (error) {
      console.error('Error checking interest savings:', error);
    }
  }

  // Check and send debt avalanche recommendations
  private async checkDebtAvalancheRecommendation(userId: string) {
    try {
      const recommendation = await debtCalculationService.getDebtAvalancheRecommendation(userId);
      
      // Send recommendation if potential savings are significant (>$50)
      if (recommendation.potentialSavings >= 50) {
        await notificationService.sendDebtAvalancheNotification(
          userId,
          recommendation.recommendedDebt,
          recommendation.potentialSavings.toFixed(2)
        );
      }
    } catch (error) {
      console.error('Error checking debt avalanche recommendation:', error);
    }
  }

  // Send Axos earnings notifications (weekly)
  async sendAxosEarningsNotifications() {
    try {
      const users = await storage.getAllUsers();
      
      for (const user of users) {
        const earnings = await debtCalculationService.calculateAxosEarnings(user.id);
        
        if (earnings.weeklyEarnings >= 1) { // Only if earnings are at least $1
          await notificationService.sendAxosEarningsNotification(
            user.id,
            earnings.weeklyEarnings.toFixed(2),
            earnings.totalEarnings.toFixed(2),
            earnings.realWorldValue
          );
        }
      }
    } catch (error) {
      console.error('Error sending Axos earnings notifications:', error);
    }
  }

  // Send DTT rewards notifications
  async sendDTTRewardsNotifications() {
    try {
      const users = await storage.getAllUsers();
      
      for (const user of users) {
        // Mock DTT calculation (in real app, get from DTT service)
        const summary = await storage.getDashboardSummary(user.id);
        const totalRoundUps = parseFloat(summary.totalRoundUps || '0');
        
        // Mock: 1 DTT per $10 in round-ups
        const tokensEarned = (totalRoundUps / 10 * 0.1).toFixed(8); // Weekly earnings
        const totalTokens = (totalRoundUps / 10).toFixed(8);
        const dollarValue = (parseFloat(totalTokens) * 0.15).toFixed(2); // Mock $0.15 per DTT
        
        if (parseFloat(tokensEarned) >= 0.001) {
          await notificationService.sendDTTRewardsNotification(
            user.id,
            tokensEarned,
            dollarValue,
            totalTokens
          );
        }
      }
    } catch (error) {
      console.error('Error sending DTT rewards notifications:', error);
    }
  }

  // Send streak maintenance notifications
  async sendStreakMaintenanceNotifications() {
    try {
      const users = await storage.getAllUsers();
      
      for (const user of users) {
        const streak = await debtCalculationService.calculateRoundUpStreak(user.id);
        
        // Send streak notification if user has a streak of 3+ days
        if (streak.streakDays >= 3) {
          await notificationService.sendStreakMaintenanceNotification(
            user.id,
            streak.streakDays,
            streak.nextAction
          );
        }
      }
    } catch (error) {
      console.error('Error sending streak maintenance notifications:', error);
    }
  }

  // Send morning motivation notifications (daily)
  async sendMorningMotivationNotifications() {
    try {
      const users = await storage.getAllUsers();
      
      for (const user of users) {
        const settings = await storage.getNotificationSettings(user.id);
        if (!settings?.marketingMessages) continue; // Use marketing setting as motivation opt-in
        
        // Calculate daily goal (average round-up per day)
        const transactions = await storage.getUserTransactions(user.id, 30);
        const monthlyRoundUps = transactions.reduce((sum, t) => sum + parseFloat(t.roundUpAmount || '0'), 0);
        const dailyGoal = (monthlyRoundUps / 30).toFixed(2);
        
        const progressMessages = [
          "You're building unstoppable momentum",
          "Every round-up brings you closer to freedom",
          "Small steps lead to big victories",
          "You're in control of your financial future",
          "Today is another step toward debt freedom"
        ];
        
        const progressMessage = progressMessages[Math.floor(Math.random() * progressMessages.length)];
        
        await notificationService.sendMorningMotivationNotification(
          user.id,
          dailyGoal,
          progressMessage
        );
      }
    } catch (error) {
      console.error('Error sending morning motivation notifications:', error);
    }
  }

  // Send evening celebration notifications (daily)
  async sendEveningCelebrationNotifications() {
    try {
      const users = await storage.getAllUsers();
      
      for (const user of users) {
        const settings = await storage.getNotificationSettings(user.id);
        if (!settings?.marketingMessages) continue;
        
        // Calculate today's round-ups
        const todayTransactions = await storage.getUserTransactions(user.id, 1);
        const todayRoundUps = todayTransactions
          .filter(t => new Date(t.date).toDateString() === new Date().toDateString())
          .reduce((sum, t) => sum + parseFloat(t.roundUpAmount || '0'), 0);
        
        if (todayRoundUps > 0) {
          const encouragementMessages = [
            "Debt freedom is getting closer every day",
            "You're building wealth one round-up at a time",
            "Tomorrow brings new opportunities to save",
            "Your consistency is paying off",
            "Keep up this amazing momentum"
          ];
          
          const encouragementMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
          
          await notificationService.sendEveningCelebrationNotification(
            user.id,
            todayRoundUps.toFixed(2),
            encouragementMessage
          );
        }
      }
    } catch (error) {
      console.error('Error sending evening celebration notifications:', error);
    }
  }

  // Send premium feature teasers (weekly)
  async sendPremiumTeaserNotifications() {
    try {
      const users = await storage.getAllUsers();
      
      for (const user of users) {
        const features = [
          { name: "Debt Consolidation", savings: "89" },
          { name: "Advanced Analytics", savings: "45" },
          { name: "Automated Debt Payoff", savings: "156" },
          { name: "Premium DTT Staking", savings: "67" },
          { name: "Smart Round-up Optimization", savings: "234" }
        ];
        
        const randomFeature = features[Math.floor(Math.random() * features.length)];
        
        await notificationService.sendPremiumTeaserNotification(
          user.id,
          randomFeature.name,
          randomFeature.savings
        );
      }
    } catch (error) {
      console.error('Error sending premium teaser notifications:', error);
    }
  }

  // Send seasonal notifications
  async sendSeasonalNotifications(occasion: string, tip: string) {
    try {
      const users = await storage.getAllUsers();
      
      for (const user of users) {
        await notificationService.sendSeasonalNotification(user.id, occasion, tip);
      }
    } catch (error) {
      console.error('Error sending seasonal notifications:', error);
    }
  }

  // Send weekly challenge notifications
  async sendWeeklyChallengeNotifications() {
    try {
      const users = await storage.getAllUsers();
      
      const challenges = [
        { goal: "Save $25 in round-ups", reward: "bonus 50 DTT tokens" },
        { goal: "Make 15 round-up transactions", reward: "2x DTT multiplier" },
        { goal: "Pay extra $50 toward debt", reward: "premium feature trial" },
        { goal: "Complete 7 consecutive days", reward: "exclusive badge" },
        { goal: "Reach $100 total round-ups", reward: "debt consultation call" }
      ];
      
      for (const user of users) {
        const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        
        await notificationService.sendWeeklyChallengeNotification(
          user.id,
          randomChallenge.goal,
          randomChallenge.reward
        );
      }
    } catch (error) {
      console.error('Error sending weekly challenge notifications:', error);
    }
  }
}

export const notificationTriggers = new NotificationTriggers();