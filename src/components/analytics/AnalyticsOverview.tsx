
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Campaign } from "@/models/CampaignTypes";
import { PerformanceChart, PlatformComparisonChart } from "./charts";
import { AIOptimizationCard, AIInsightsCard } from "./insights";
import { 
  performanceData, 
  platformComparisonData, 
  optimizationData, 
  insightsData 
} from "./data/mockData";

interface AnalyticsOverviewProps {
  campaigns: Campaign[];
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ campaigns }) => {
  // Calculate overall metrics from campaigns
  const totalImpressions = campaigns.reduce((total, campaign) => 
    total + (campaign.performance?.impressions || 0), 0);
  
  const totalClicks = campaigns.reduce((total, campaign) => 
    total + (campaign.performance?.clicks || 0), 0);
  
  const avgCTR = totalImpressions > 0 
    ? (totalClicks / totalImpressions) * 100 
    : 0;
  
  const totalSpend = campaigns.reduce((total, campaign) => 
    total + (campaign.performance?.spend || 0), 0);

  // For demonstration purposes showing last optimization: 24 hours ago
  const lastOptimizationTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Performance Overview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Performance Overview</CardTitle>
              <CardDescription>Last 7 days of campaign data</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceChart data={performanceData} />
            </CardContent>
          </Card>

          {/* Platform Comparison */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Platform Comparison</CardTitle>
              <CardDescription>Google Ads vs Meta Ads performance</CardDescription>
            </CardHeader>
            <CardContent>
              <PlatformComparisonChart data={platformComparisonData} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Optimization Summary */}
          <AIOptimizationCard 
            lastOptimizationTime={lastOptimizationTime}
            topPerformers={optimizationData.topPerformers}
            lowPerformers={optimizationData.lowPerformers}
            budgetReallocations={optimizationData.budgetReallocation}
          />

          {/* AI Insights */}
          <AIInsightsCard insights={insightsData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
