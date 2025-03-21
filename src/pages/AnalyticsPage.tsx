
import React, { useMemo } from "react";
import SafeAppLayout from "@/components/SafeAppLayout";
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
    </SafeAppLayout>
  );
};

export default AnalyticsPage;
