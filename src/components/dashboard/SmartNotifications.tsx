
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertCircle, AlertTriangle, Info, Check, X } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "critical" | "warning" | "info";
  timestamp: Date;
  isRead: boolean;
}

const SmartNotifications: React.FC = () => {
  // Sample notifications (would come from API in production)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Budget Alert",
      message: "Your 'Summer Sale' campaign has spent 90% of its budget and will stop soon.",
      type: "critical",
      timestamp: new Date(Date.now() - 30 * 60000), // 30 mins ago
      isRead: false
    },
    {
      id: "2",
      title: "Ad Approval",
      message: "Your Google search ad has been approved and is now running.",
      type: "info",
      timestamp: new Date(Date.now() - 3 * 3600000), // 3 hours ago
      isRead: false
    },
    {
      id: "3",
      title: "Performance Drop",
      message: "Your 'Product Launch' campaign CTR has dropped by 25% in the last 24 hours.",
      type: "warning",
      timestamp: new Date(Date.now() - 5 * 3600000), // 5 hours ago
      isRead: false
    },
    {
      id: "4",
      title: "Credit Usage",
      message: "You've used 75% of your monthly credits. Consider upgrading your plan.",
      type: "warning",
      timestamp: new Date(Date.now() - 8 * 3600000), // 8 hours ago
      isRead: true
    }
  ]);
  
  const [activeFilter, setActiveFilter] = useState<"all" | "critical" | "warning" | "info">("all");
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };
  
  // Get filtered notifications
  const getFilteredNotifications = () => {
    if (activeFilter === "all") {
      return notifications;
    }
    return notifications.filter(notification => notification.type === activeFilter);
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case "critical": return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "info": return <Info className="h-4 w-4 text-blue-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };
  
  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };
  
  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center">
          <Bell className="mr-2 h-5 w-5 text-foreground" />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">
              {unreadCount} new
            </Badge>
          )}
        </CardTitle>
        
        <div className="flex space-x-1">
          <Button 
            variant={activeFilter === "all" ? "secondary" : "ghost"} 
            size="sm"
            className="text-xs px-2 h-7"
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={activeFilter === "critical" ? "secondary" : "ghost"} 
            size="sm"
            className="text-xs px-2 h-7"
            onClick={() => setActiveFilter("critical")}
          >
            Critical
          </Button>
          <Button 
            variant={activeFilter === "warning" ? "secondary" : "ghost"} 
            size="sm"
            className="text-xs px-2 h-7"
            onClick={() => setActiveFilter("warning")}
          >
            Warning
          </Button>
          <Button 
            variant={activeFilter === "info" ? "secondary" : "ghost"} 
            size="sm"
            className="text-xs px-2 h-7"
            onClick={() => setActiveFilter("info")}
          >
            Info
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-[360px] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No notifications to display
          </div>
        ) : (
          <div className="divide-y">
            {filteredNotifications.map((notification) => (
              <div key={notification.id} className={`p-4 hover:bg-muted/50 transition-colors ${!notification.isRead ? 'bg-muted/20' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{getTimeAgo(notification.timestamp)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 mb-2">{notification.message}</p>
                    <div className="flex items-center gap-2">
                      {notification.isRead ? (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Check className="h-3 w-3 mr-1" /> Read
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-7 px-2"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                      
                      {notification.type === "critical" && (
                        <Button size="sm" className="text-xs h-7 px-2">
                          Take action
                        </Button>
                      )}
                      
                      {notification.type === "warning" && (
                        <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                          View details
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 h-7 w-7"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartNotifications;
