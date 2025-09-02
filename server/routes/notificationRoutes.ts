import { Router, Request, Response } from "express";
import { notificationService } from "../services/notificationService";
import { notificationTriggers } from "../services/notificationTriggers";
import { storage } from "../storage";

export const notificationRoutes = Router();

// Get user notifications
notificationRoutes.get("/api/notifications/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    
    const notifications = await notificationService.getUserNotifications(userId, limit);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// Mark notification as read
notificationRoutes.post("/api/notifications/:id/read", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const updatedNotification = await notificationService.markAsRead(id);
    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    res.json(updatedNotification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: "Failed to update notification" });
  }
});

// Test notification endpoint (for development)
notificationRoutes.post("/api/notifications/test", async (req: Request, res: Response) => {
  try {
    const { userId, type, amount, merchant } = req.body;
    
    let notification;
    
    switch (type) {
      case 'roundup':
        notification = await notificationService.sendRoundUpNotification(userId, amount, merchant);
        break;
      case 'payment_due':
        notification = await notificationService.sendPaymentDueNotification(userId, 'Chase Freedom', amount, 3);
        break;
      case 'milestone':
        notification = await notificationService.sendMilestoneNotification(userId, '$50 in round-ups collected!', 25);
        break;
      case 'weekly_report':
        notification = await notificationService.sendWeeklyReportNotification(userId, amount, '156.72', 2);
        break;
      case 'crypto':
        notification = await notificationService.sendCryptoUpdateNotification(userId, amount, '125.50', '12.30');
        break;
      case 'motivation':
        notification = await notificationService.sendMotivationalNotification(userId, '');
        break;
      default:
        return res.status(400).json({ message: "Invalid notification type" });
    }
    
    res.json({ success: true, notification });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ message: "Failed to send notification" });
  }
});

// Trigger notification events manually (for testing)
notificationRoutes.post("/api/notifications/trigger", async (req: Request, res: Response) => {
  try {
    const { userId, event, data } = req.body;
    
    switch (event) {
      case 'roundup_collected':
        await notificationTriggers.onRoundUpCollected(userId, data.transactionId, data.amount, data.merchant);
        break;
      case 'debt_payment':
        await notificationTriggers.onDebtPaymentProcessed(userId, data.debtId, data.amount);
        break;
      case 'crypto_investment':
        await notificationTriggers.onCryptoInvestment(userId, data.amount, data.symbol);
        break;
      default:
        return res.status(400).json({ message: "Invalid event type" });
    }
    
    res.json({ success: true, message: `${event} notification triggered` });
  } catch (error) {
    console.error('Error triggering notification:', error);
    res.status(500).json({ message: "Failed to trigger notification" });
  }
});

// Enable/disable browser notifications
notificationRoutes.post("/api/notifications/browser-permission", async (req: Request, res: Response) => {
  try {
    const { permission } = req.body;
    
    // This endpoint acknowledges the browser notification permission status
    // Actual permission handling is done client-side
    
    res.json({ 
      success: true, 
      message: `Browser notifications ${permission}`,
      permission 
    });
  } catch (error) {
    console.error('Error handling browser permission:', error);
    res.status(500).json({ message: "Failed to update browser permission" });
  }
});

// Get notification statistics
notificationRoutes.get("/api/notifications/:userId/stats", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const allNotifications = await notificationService.getUserNotifications(userId, 100);
    const unreadCount = allNotifications.filter(n => n.status === 'pending' || n.status === 'sent').length;
    const totalCount = allNotifications.length;
    
    const typeStats = allNotifications.reduce((stats: any, notification) => {
      stats[notification.type] = (stats[notification.type] || 0) + 1;
      return stats;
    }, {});
    
    res.json({
      unreadCount,
      totalCount,
      typeStats,
      recentNotifications: allNotifications.slice(0, 5)
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({ message: "Failed to fetch notification statistics" });
  }
});