import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  Zap,
  TestTube
} from "lucide-react";

export default function NotificationTest() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const testNotification = async (type: string, data: any = {}) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user-1',
          type,
          ...data
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "✅ Notification Sent!",
          description: `Test ${type} notification delivered successfully`,
        });
        
        // Show browser notification if permission granted
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`Test ${type} notification`, {
            body: `Successfully tested ${type} notification`,
            icon: '/favicon.ico'
          });
        }
      } else {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to send test notification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      toast({
        title: permission === 'granted' ? "✅ Permission Granted" : "⚠️ Permission Denied",
        description: permission === 'granted' 
          ? "You'll now receive push notifications!" 
          : "Enable notifications in browser settings to receive alerts",
      });
    }
  };

  const notificationTypes = [
    {
      type: 'roundup',
      icon: DollarSign,
      title: 'Round-up Collected',
      description: 'Test round-up notification',
      color: 'text-green-500',
      data: { amount: '2.47', merchant: 'Starbucks' }
    },
    {
      type: 'payment_due',
      icon: CreditCard,
      title: 'Payment Due',
      description: 'Test payment reminder',
      color: 'text-blue-500',
      data: { amount: '165.00' }
    },
    {
      type: 'milestone',
      icon: Zap,
      title: 'Milestone Achieved',
      description: 'Test milestone celebration',
      color: 'text-purple-500',
      data: {}
    },
    {
      type: 'weekly_report',
      icon: Calendar,
      title: 'Weekly Report',
      description: 'Test weekly summary',
      color: 'text-orange-500',
      data: { amount: '23.45' }
    },
    {
      type: 'crypto',
      icon: TrendingUp,
      title: 'Crypto Update',
      description: 'Test crypto notification',
      color: 'text-yellow-500',
      data: { amount: '158.72' }
    },
    {
      type: 'motivation',
      icon: Bell,
      title: 'Daily Motivation',
      description: 'Test motivational message',
      color: 'text-pink-500',
      data: {}
    }
  ];

  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Notification Testing Center
        </CardTitle>
        <CardDescription>
          Test different notification types to verify the push notification system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Permission Section */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/10 rounded-lg">
          <h4 className="font-medium mb-2">Browser Notifications</h4>
          <p className="text-sm text-gray-600 mb-3">
            Enable browser notifications to receive real-time alerts
          </p>
          <Button onClick={requestNotificationPermission} variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Enable Notifications
          </Button>
        </div>

        {/* Test Notifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notificationTypes.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <div 
                key={notification.type}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <IconComponent className={`h-5 w-5 ${notification.color}`} />
                  <div>
                    <h5 className="font-medium">{notification.title}</h5>
                    <p className="text-sm text-gray-600">{notification.description}</p>
                  </div>
                </div>
                <Button
                  onClick={() => testNotification(notification.type, notification.data)}
                  disabled={isLoading}
                  size="sm"
                  className="w-full"
                  data-testid={`button-test-${notification.type}`}
                >
                  Test {notification.title}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Status Info */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Badge variant="outline">Development Mode</Badge>
            <span>Notifications will appear in browser and console</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}