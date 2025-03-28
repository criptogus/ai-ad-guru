
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIInsightsCard, AIOptimizationCard } from "@/components/analytics/insights";
import SmartNotifications from "@/components/dashboard/SmartNotifications";
import PerformanceAnalysis from "@/components/analytics/PerformanceAnalysis";

const InsightsTabContent: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Smart Notifications in a full width row */}
      <div className="grid grid-cols-1 gap-6">
        <SmartNotifications />
      </div>
      
      {/* AI Optimization in a full width row */}
      <div className="grid grid-cols-1 gap-6">
        <AIOptimizationCard />
      </div>
      
      {/* AI Insights in a full width row */}
      <div className="grid grid-cols-1 gap-6">
        <AIInsightsCard campaignId="insights-tab" />
      </div>
      
      {/* Performance Analysis */}
      <div className="grid grid-cols-1 gap-6">
        <PerformanceAnalysis />
      </div>
    </div>
  );
};

export default InsightsTabContent;
