
import React from "react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { generateMockCampaigns, Campaign } from "@/models/CampaignTypes";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsOverview from "@/components/dashboard/StatsOverview";
import ActiveCampaigns from "@/components/dashboard/ActiveCampaigns";
import CreditsStatus from "@/components/dashboard/CreditsStatus";

// Create an interface that matches what the dashboard components expect
interface DashboardUser {
  name: string;
  credits: number;
  hasPaid: boolean;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  
  React.useEffect(() => {
    // In a real app, we would fetch campaigns from an API
    const mockCampaigns = generateMockCampaigns(3);
    setCampaigns(mockCampaigns);
  }, []);

  // Convert CustomUser to DashboardUser with required properties
  const dashboardUser: DashboardUser = {
    name: user?.name || 'User',
    credits: user?.credits || 0,
    hasPaid: user?.hasPaid || false
  };

  return (
    <AppLayout activePage="dashboard">
      <div className="p-8">
        <DashboardHeader user={dashboardUser} />
        <StatsOverview campaigns={campaigns} />
        <ActiveCampaigns campaigns={campaigns} />
        <CreditsStatus user={dashboardUser} />
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
