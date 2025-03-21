
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIInsightsCard, AIOptimizationCard } from "@/components/analytics/insights";
import SmartNotifications from "@/components/dashboard/SmartNotifications";

const InsightsTabContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-6 mb-6">
        {/* Notifications and AI Optimization in a horizontal row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SmartNotifications />
          <AIOptimizationCard />
        </div>
        
        {/* AI Insights in a full width row */}
        <div className="grid grid-cols-1 gap-6">
          <AIInsightsCard />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-md">
            <p className="text-sm text-muted-foreground">Performance chart will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsTabContent;
