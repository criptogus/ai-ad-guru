
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
import { 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  BarChart
} from "lucide-react";

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

  // Calculate weekly change (mock data for demonstration)
  const weeklyChange = {
    impressions: 12.5,
    clicks: 8.3,
    ctr: -2.1,
    spend: 5.7
  };

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
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Impressions" 
          value={totalImpressions.toLocaleString()} 
          change={weeklyChange.impressions} 
          icon={<BarChart className="h-4 w-4" />}
        />
        <MetricCard 
          title="Clicks" 
          value={totalClicks.toLocaleString()} 
          change={weeklyChange.clicks} 
          icon={<BarChart className="h-4 w-4" />}
        />
        <MetricCard 
          title="CTR" 
          value={`${avgCTR.toFixed(2)}%`} 
          change={weeklyChange.ctr} 
          icon={<BarChart className="h-4 w-4" />}
        />
        <MetricCard 
          title="Ad Spend" 
          value={`$${totalSpend.toFixed(2)}`} 
          change={weeklyChange.spend} 
          icon={<BarChart className="h-4 w-4" />}
        />
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
          
          {/* Campaign Health Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Campaign Health</CardTitle>
              <CardDescription>AI-detected issues and anomalies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <HealthItem 
                  status="success" 
                  message="Overall campaign performance is strong with 12.5% higher CTR than industry average" 
                />
                <HealthItem 
                  status="warning" 
                  message="Meta campaign 'Summer Sale' shows declining CTR over the past 3 days" 
                />
                <HealthItem 
                  status="error" 
                  message="Google campaign 'Product Launch' has high CPC with low conversion rate" 
                />
              </div>
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

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <div className="text-2xl font-medium mb-1">{value}</div>
          </div>
          <div className="p-2 rounded-full bg-muted">{icon}</div>
        </div>
        <div className="flex items-center mt-2">
          {change >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '+' : ''}{change}% from last week
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Health Item Component
interface HealthItemProps {
  status: 'success' | 'warning' | 'error';
  message: string;
}

const HealthItem: React.FC<HealthItemProps> = ({ status, message }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className={`flex p-3 rounded-md ${
      status === 'success' ? 'bg-green-50 border-green-200' : 
      status === 'warning' ? 'bg-amber-50 border-amber-200' : 
      'bg-red-50 border-red-200'
    } border`}>
      <div className="mt-0.5 mr-3">{getStatusIcon()}</div>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default AnalyticsOverview;
