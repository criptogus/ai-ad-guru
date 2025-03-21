
import React from "react";
import { AIInsightsCard, AIOptimizationCard } from "@/components/analytics/insights";
import BusinessOverview from "@/components/dashboard/BusinessOverview";
import LeaderboardSection from "@/components/dashboard/LeaderboardSection";
import SmartNotifications from "@/components/dashboard/SmartNotifications";
import CampaignSummaryCards from "@/components/dashboard/CampaignSummaryCards";
import { Campaign } from "@/models/CampaignTypes";

interface DashboardTabContentProps {
  campaigns: Campaign[];
}

const DashboardTabContent: React.FC<DashboardTabContentProps> = ({ campaigns }) => {
  return (
    <div className="space-y-6">
      {/* Horizontal row for Notifications and AI Optimization at the top */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SmartNotifications />
        <AIOptimizationCard />
      </div>
      
      {/* Top Performing and Needs Attention in a horizontal row */}
      <LeaderboardSection campaigns={campaigns} />
      
      <BusinessOverview campaigns={campaigns} />
      
      {/* Main content - Full width for campaigns */}
      <div className="grid grid-cols-1 gap-6">
        <CampaignSummaryCards campaigns={campaigns} />
      </div>
      
      {/* AI Insights in a full width row */}
      <div className="grid grid-cols-1 gap-6">
        <AIInsightsCard />
      </div>
    </div>
  );
};

export default DashboardTabContent;
