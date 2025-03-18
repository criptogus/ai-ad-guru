
import React from "react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { generateMockCampaigns, Campaign } from "@/models/CampaignTypes";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsOverview from "@/components/dashboard/StatsOverview";
import ActiveCampaigns from "@/components/dashboard/ActiveCampaigns";
import CreditsStatus from "@/components/dashboard/CreditsStatus";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AiInsights from "@/components/dashboard/AiInsights";

// Create an interface that matches what the dashboard components expect
interface DashboardUser {
  name: string;
  credits: number;
  hasPaid: boolean;
  id?: string;
  email?: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  
  React.useEffect(() => {
    // In a real app, we would fetch campaigns from an API
    const mockCampaigns = generateMockCampaigns(5);
    setCampaigns(mockCampaigns);
  }, []);

  // Convert CustomUser to DashboardUser with required properties
  const dashboardUser: DashboardUser = {
    name: user?.name || 'User',
    credits: user?.credits || 0,
    hasPaid: user?.hasPaid || false,
    id: user?.id,
    email: user?.email
  };

  return (
    <AppLayout activePage="dashboard">
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
        <DashboardHeader user={dashboardUser} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <StatsOverview campaigns={campaigns} />
          </div>
          <div>
            <CreditsStatus user={dashboardUser} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActiveCampaigns campaigns={campaigns} />
          </div>
          <div className="space-y-6">
            <AiInsights />
            <RecentActivity campaigns={campaigns} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
