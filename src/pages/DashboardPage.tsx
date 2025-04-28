
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { generateMockCampaigns, Campaign } from "@/models/CampaignTypes";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BusinessOverview from "@/components/dashboard/BusinessOverview";
import ActiveCampaigns from "@/components/dashboard/ActiveCampaigns";
import CreditsStatus from "@/components/dashboard/CreditsStatus";
import AiInsights from "@/components/dashboard/AiInsights";
import LeaderboardSection from "@/components/dashboard/LeaderboardSection";
import SmartNotifications from "@/components/dashboard/SmartNotifications";
import CampaignSummaryCards from "@/components/dashboard/CampaignSummaryCards";
import { useIsMobile } from "@/hooks/use-mobile";
import AppLayout from "@/components/AppLayout";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const isMobile = useIsMobile();
  
  React.useEffect(() => {
    const mockCampaigns = generateMockCampaigns(isMobile ? 3 : 5);
    setCampaigns(mockCampaigns);
  }, [isMobile]);

  const dashboardUser = {
    name: user?.name || 'User',
    credits: user?.credits || 0,
    hasPaid: user?.hasPaid || false,
    id: user?.id,
    email: user?.email
  };

  return (
    <AppLayout activePage="dashboard">
      <div className="space-y-6">
        <DashboardHeader user={dashboardUser} />
        <div className="grid grid-cols-1 gap-6">
          <SmartNotifications />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <CreditsStatus user={dashboardUser} />
        </div>
        <LeaderboardSection campaigns={campaigns} />
        <BusinessOverview campaigns={campaigns} />
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-6">
            <CampaignSummaryCards campaigns={campaigns} />
            <ActiveCampaigns campaigns={campaigns} />
          </div>
          <AiInsights />
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
