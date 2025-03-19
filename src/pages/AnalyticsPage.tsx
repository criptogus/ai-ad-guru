
import React from "react";
import { generateMockCampaigns } from "@/models/CampaignTypes";
import AnalyticsOverview from "@/components/analytics/AnalyticsOverview";

const AnalyticsPage: React.FC = () => {
  // For demonstration purposes, using mock campaigns
  // In a real app, this would come from an API or context
  const campaigns = generateMockCampaigns(10);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Analytics & Optimization</h1>
        <p className="text-muted-foreground">
          AI-powered insights and campaign performance data
        </p>
      </div>
      
      <AnalyticsOverview campaigns={campaigns} />
    </div>
  );
};

export default AnalyticsPage;
