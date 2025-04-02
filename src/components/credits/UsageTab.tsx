
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, BarChart3 } from "lucide-react";
import { getCreditUsageHistory, getCreditUsageSummary } from "@/services/credits";
import { CreditAction } from "@/services/credits/types";

const UsageTab: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [usageSummary, setUsageSummary] = useState<Record<string, number>>({});
  
  useEffect(() => {
    const fetchUsageData = async () => {
      if (!user?.id) return;
      
      try {
        const summary = await getCreditUsageSummary(user.id);
        setUsageSummary(summary);
      } catch (error) {
        console.error('Error fetching credit usage:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsageData();
  }, [user]);
  
  const formatActionName = (action: string): string => {
    // Handle special formats
    if (action.includes('.')) {
      const [base, frequency] = action.split('.');
      return `${base.charAt(0).toUpperCase() + base.slice(1)} (${frequency})`;
    }
    
    // Normal formatting
    return action
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  };
  
  const getColorClass = (action: string): string => {
    if (action.includes('google')) return 'bg-blue-100 dark:bg-blue-900/20';
    if (action.includes('meta')) return 'bg-purple-100 dark:bg-purple-900/20';
    if (action.includes('image')) return 'bg-green-100 dark:bg-green-900/20';
    if (action.includes('optimization')) return 'bg-amber-100 dark:bg-amber-900/20';
    return 'bg-gray-100 dark:bg-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }
  
  // If no usage data
  if (Object.keys(usageSummary).length === 0) {
    return (
      <Card>
        <CardContent className="p-8 flex flex-col items-center text-center">
          <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Credit Usage Yet</h3>
          <p className="text-muted-foreground">
            You haven't used any credits yet. Start creating campaigns and ads to see your usage here.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Credit Usage Summary</h3>
          <div className="space-y-4">
            {Object.entries(usageSummary).map(([action, amount]) => (
              <div key={action} className="flex items-center">
                <div className={`rounded-full w-2 h-2 mr-2 ${getColorClass(action)}`}></div>
                <div className="flex-1">{formatActionName(action)}</div>
                <div className="font-medium">{amount} credits</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageTab;
