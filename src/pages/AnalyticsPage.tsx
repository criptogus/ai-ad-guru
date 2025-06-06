// ====================================================
// 🚨 DO NOT MODIFY, MOVE, OR DELETE THIS FILE! 🚨
// This is a LIVE PRODUCTION PAGE for Analytics.
// Only the project owner may approve changes.
// See: src/config/protectedPages.ts
// ====================================================
import React, { useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateMockCampaigns, convertToCampaignType } from "@/components/analytics/AnalyticsMockData";
import {
  DashboardTabContent,
  CampaignsTabContent,
  InsightsTabContent,
  PerformanceTabContent
} from "@/components/analytics/tabs";

const AnalyticsPage: React.FC = () => {
  const mockCampaigns = useMemo(() => generateMockCampaigns(), []);
  const campaigns = useMemo(() => convertToCampaignType(mockCampaigns), [mockCampaigns]);
  
  return (
    <AppLayout activePage="analytics">
      <div className="w-full">
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <h1 className="text-2xl font-medium text-foreground mb-6">Analytics & Insights</h1>
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="campaigns">Campaign Analytics</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <DashboardTabContent campaigns={campaigns} />
            </TabsContent>
            <TabsContent value="campaigns">
              <CampaignsTabContent campaigns={campaigns} />
            </TabsContent>
            <TabsContent value="insights">
              <InsightsTabContent />
            </TabsContent>
            <TabsContent value="performance">
              <PerformanceTabContent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;
