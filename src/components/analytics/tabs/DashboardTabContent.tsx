
import React from "react";
import { AIInsightsCard, AIOptimizationCard } from "@/components/analytics/insights";
import BusinessOverview from "@/components/dashboard/BusinessOverview";
import LeaderboardSection from "@/components/dashboard/LeaderboardSection";
import SmartNotifications from "@/components/dashboard/SmartNotifications";
import CampaignSummaryCards from "@/components/dashboard/CampaignSummaryCards";
import { Campaign } from "@/models/CampaignTypes";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardTabContentProps {
  campaigns: Campaign[];
}

const DashboardTabContent: React.FC<DashboardTabContentProps> = ({ campaigns }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Full width for Notifications */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <SmartNotifications />
      </div>
      
      {/* AI Optimization in its own row */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <AIOptimizationCard />
      </div>
      
      {/* Top Performing and Needs Attention in a horizontal row */}
      <LeaderboardSection campaigns={campaigns} />
      
      <BusinessOverview campaigns={campaigns} />
      
      {/* Main content - Full width for campaigns */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <CampaignSummaryCards campaigns={campaigns} />
      </div>
      
      {/* AI Insights in a full width row */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <AIInsightsCard campaignId="dashboard-insights" />
      </div>
    </div>
  );
};

export default DashboardTabContent;
