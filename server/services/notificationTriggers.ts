import { notificationService } from "./notificationService";
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
}

export const notificationTriggers = new NotificationTriggers();