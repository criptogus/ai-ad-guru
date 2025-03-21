
import React, { useMemo } from "react";
import SafeAppLayout from "@/components/SafeAppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIInsightsCard, AIOptimizationCard } from "@/components/analytics/insights";
import PerformanceAnalysis from "@/components/analytics/PerformanceAnalysis";
import BusinessOverview from "@/components/dashboard/BusinessOverview";
import CampaignSummaryCards from "@/components/dashboard/CampaignSummaryCards";
import LeaderboardSection from "@/components/dashboard/LeaderboardSection";
import SmartNotifications from "@/components/dashboard/SmartNotifications";
import { Campaign } from "@/components/analytics/AnalyticsOverview";

const AnalyticsPage: React.FC = () => {
  // Generate mock campaigns with the correct shape
  const campaigns = useMemo((): Campaign[] => {
    return [
      {
        id: "campaign-1",
        name: "Google Search Campaign",
        platform: "google",
        status: "active",
        budget: 500,
        spent: 320.45,
        clicks: 1250,
        impressions: 28400,
        conversions: 42,
        ctr: 4.4,
        startDate: "2023-08-15",
        endDate: "2023-09-15",
        performance: {
          clicks: 1250,
          impressions: 28400,
          conversions: 42,
          ctr: 4.4,
          spend: 320.45
        },
        budgetType: "monthly"
      },
      {
        id: "campaign-2",
        name: "Meta Awareness Campaign",
        platform: "meta",
        status: "active",
        budget: 750,
        spent: 523.78,
        clicks: 3420,
        impressions: 76500,
        conversions: 104,
        ctr: 4.47,
        startDate: "2023-08-01",
        endDate: "2023-09-01",
        performance: {
          clicks: 3420,
          impressions: 76500,
          conversions: 104,
          ctr: 4.47,
          spend: 523.78
        },
        budgetType: "monthly"
      },
      {
        id: "campaign-3",
        name: "Google Display Campaign",
        platform: "google",
        status: "paused",
        budget: 300,
        spent: 142.25,
        clicks: 840,
        impressions: 24600,
        conversions: 12,
        ctr: 3.41,
        startDate: "2023-07-20",
        endDate: "2023-08-20",
        performance: {
          clicks: 840,
          impressions: 24600,
          conversions: 12,
          ctr: 3.41,
          spend: 142.25
        },
        budgetType: "monthly"
      },
      {
        id: "campaign-4",
        name: "Meta Video Campaign",
        platform: "meta",
        status: "active",
        budget: 600,
        spent: 382.91,
        clicks: 2180,
        impressions: 42300,
        conversions: 36,
        ctr: 5.15,
        startDate: "2023-08-10",
        performance: {
          clicks: 2180,
          impressions: 42300,
          conversions: 36,
          ctr: 5.15,
          spend: 382.91
        },
        budgetType: "monthly"
      },
      {
        id: "campaign-5",
        name: "Google Performance Max",
        platform: "google",
        status: "active",
        budget: 1000,
        spent: 876.32,
        clicks: 4120,
        impressions: 92400,
        conversions: 136,
        ctr: 4.46,
        startDate: "2023-07-01",
        performance: {
          clicks: 4120,
          impressions: 92400,
          conversions: 136,
          ctr: 4.46,
          spend: 876.32
        },
        budgetType: "monthly"
      },
      {
        id: "campaign-6",
        name: "Meta Conversion Campaign",
        platform: "meta",
        status: "paused",
        budget: 450,
        spent: 214.67,
        clicks: 1340,
        impressions: 28900,
        conversions: 23,
        ctr: 4.64,
        startDate: "2023-08-05",
        endDate: "2023-09-05",
        performance: {
          clicks: 1340,
          impressions: 28900,
          conversions: 23,
          ctr: 4.64,
          spend: 214.67
        },
        budgetType: "monthly"
      },
      {
        id: "campaign-7",
        name: "Google Shopping Campaign",
        platform: "google",
        status: "active",
        budget: 800,
        spent: 623.45,
        clicks: 2840,
        impressions: 54200,
        conversions: 92,
        ctr: 5.24,
        startDate: "2023-07-15",
        performance: {
          clicks: 2840,
          impressions: 54200,
          conversions: 92,
          ctr: 5.24,
          spend: 623.45
        },
        budgetType: "monthly"
      },
      {
        id: "campaign-8",
        name: "Meta Lead Gen Campaign",
        platform: "meta",
        status: "active",
        budget: 550,
        spent: 412.32,
        clicks: 1860,
        impressions: 38700,
        conversions: 45,
        ctr: 4.81,
        startDate: "2023-08-20",
        performance: {
          clicks: 1860,
          impressions: 38700,
          conversions: 45,
          ctr: 4.81,
          spend: 412.32
        },
        budgetType: "monthly"
      }
    ];
  }, []);
  
  return (
    <SafeAppLayout activePage="analytics">
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-medium text-foreground mb-6">Analytics & Insights</h1>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign Analytics</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          {/* New Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <BusinessOverview campaigns={campaigns} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CampaignSummaryCards campaigns={campaigns.slice(0, 6)} />
              </div>
              <div>
                <SmartNotifications />
              </div>
            </div>
            
            <LeaderboardSection campaigns={campaigns} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIOptimizationCard />
              <AIInsightsCard />
            </div>
          </TabsContent>
          
          {/* Original Tabs */}
          <TabsContent value="campaigns">
            <div className="space-y-6">
              <CampaignSummaryCards campaigns={campaigns} />
            </div>
          </TabsContent>
          
          <TabsContent value="insights">
            <div className="space-y-6 mb-6">
              <AIOptimizationCard />
              <AIInsightsCard />
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
          </TabsContent>
          
          <TabsContent value="performance">
            <PerformanceAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </SafeAppLayout>
  );
};

export default AnalyticsPage;
