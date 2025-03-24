
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";

const NotificationsSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [campaignAlerts, setCampaignAlerts] = useState(true);
  const [performanceReports, setPerformanceReports] = useState(true);
  const [creditAlerts, setCreditAlerts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    // Simulate saving
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Notification settings saved successfully");
    }, 800);
  };

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Configure how you receive notifications and alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive important notifications via email
              </p>
            </div>
            <Switch 
              id="email-notifications" 
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="campaign-alerts">Campaign Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when campaign statuses change or require attention
              </p>
            </div>
            <Switch 
              id="campaign-alerts" 
              checked={campaignAlerts}
              onCheckedChange={setCampaignAlerts}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="performance-reports">Performance Reports</Label>
              <p className="text-sm text-muted-foreground">
                Weekly summary of your campaign performance
              </p>
            </div>
            <Switch 
              id="performance-reports" 
              checked={performanceReports}
              onCheckedChange={setPerformanceReports}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="credit-alerts">Credit Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts when your credits are running low
              </p>
            </div>
            <Switch 
              id="credit-alerts" 
              checked={creditAlerts}
              onCheckedChange={setCreditAlerts}
            />
          </div>
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="mt-4"
        >
          <Check className="mr-2 h-4 w-4" />
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationsSettings;
