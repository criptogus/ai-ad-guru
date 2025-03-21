
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIInsightsCard, AIOptimizationCard } from "@/components/analytics/insights";
import PlatformComparisonChart from "./charts/PlatformComparisonChart";

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: string;
  budget: number;
  spent: number;
  clicks: number;
  impressions: number;
  conversions: number;
  ctr: number;
  startDate: string;
  endDate?: string;
}

interface AnalyticsOverviewProps {
  campaigns: Campaign[];
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ campaigns }) => {
  // Calculate totals
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  
  // Prepare data for platform comparison chart
  const platformComparisonData = [
    {
      metric: "Clicks",
      google: campaigns.filter(c => c.platform === "google").reduce((sum, c) => sum + c.clicks, 0),
      meta: campaigns.filter(c => c.platform === "meta").reduce((sum, c) => sum + c.clicks, 0),
    },
    {
      metric: "Impressions",
      google: campaigns.filter(c => c.platform === "google").reduce((sum, c) => sum + c.impressions, 0) / 1000,
      meta: campaigns.filter(c => c.platform === "meta").reduce((sum, c) => sum + c.impressions, 0) / 1000,
    },
    {
      metric: "Conversions",
      google: campaigns.filter(c => c.platform === "google").reduce((sum, c) => sum + c.conversions, 0),
      meta: campaigns.filter(c => c.platform === "meta").reduce((sum, c) => sum + c.conversions, 0),
    },
    {
      metric: "Spent ($)",
      google: campaigns.filter(c => c.platform === "google").reduce((sum, c) => sum + c.spent, 0),
      meta: campaigns.filter(c => c.platform === "meta").reduce((sum, c) => sum + c.spent, 0),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics & Insights</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Spent"
          value={`$${totalSpent.toFixed(2)}`}
          description="All campaigns"
        />
        <MetricCard
          title="Total Clicks"
          value={totalClicks.toLocaleString()}
          description={`CTR: ${avgCTR.toFixed(2)}%`}
        />
        <MetricCard
          title="Impressions"
          value={totalImpressions.toLocaleString()}
          description="All campaigns"
        />
        <MetricCard
          title="Conversions"
          value={totalConversions.toLocaleString()}
          description={`CPA: $${totalConversions > 0 ? (totalSpent / totalConversions).toFixed(2) : 0}`}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="platforms">Platform Comparison</TabsTrigger>
              <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {/* Placeholder for overview chart */}
                    <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-md border">
                      <p className="text-gray-500">Performance chart will appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="platforms">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <PlatformComparisonChart data={platformComparisonData} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="campaigns">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {/* Placeholder for campaign performance chart */}
                    <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-md border">
                      <p className="text-gray-500">Campaign performance chart will appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <AIInsightsCard />
          <AIOptimizationCard />
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm font-medium mt-1">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default AnalyticsOverview;
