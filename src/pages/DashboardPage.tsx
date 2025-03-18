
import React from "react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { generateMockCampaigns, Campaign } from "@/models/CampaignTypes";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsOverview from "@/components/dashboard/StatsOverview";
import ActiveCampaigns from "@/components/dashboard/ActiveCampaigns";
import CreditsStatus from "@/components/dashboard/CreditsStatus";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  
  React.useEffect(() => {
    // In a real app, we would fetch campaigns from an API
    const mockCampaigns = generateMockCampaigns(3);
    setCampaigns(mockCampaigns);
  }, []);

  return (
    <AppLayout activePage="dashboard">
      <div className="p-8">
        <DashboardHeader user={user} />
        <StatsOverview campaigns={campaigns} />
        <ActiveCampaigns campaigns={campaigns} />
        <CreditsStatus user={user} />
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
