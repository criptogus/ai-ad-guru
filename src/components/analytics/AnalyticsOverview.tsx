
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Campaign } from "@/models/CampaignTypes";
import { PerformanceChart, PlatformComparisonChart } from "./charts";
import { AIOptimizationCard, AIInsightsCard } from "./insights";
import { 
  performanceData, 
  platformComparisonData, 
  optimizationData
} from "./data/mockData";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface AnalyticsOverviewProps {
  campaigns: Campaign[];
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ campaigns }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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
  
  // Handle refresh of AI insights
  const handleRefreshInsights = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-medium">Campaign Overview</h2>
          <p className="text-sm text-muted-foreground">Performance metrics across all campaigns</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={handleRefreshInsights}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Insights
        </Button>
      </div>
      
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

          {/* AI Insights - Now using the OpenAI-powered version */}
          <AIInsightsCard 
            isLoading={isRefreshing}
            onRefresh={handleRefreshInsights}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
