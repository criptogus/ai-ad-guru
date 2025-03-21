
import React from "react";
import AppLayout from "@/components/AppLayout";
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
      <div className="space-y-6">
        <DashboardHeader user={dashboardUser} />
        
        {/* Horizontal row for Credits Status and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CreditsStatus user={dashboardUser} />
          <SmartNotifications />
        </div>
        
        {/* Business Overview */}
        <BusinessOverview campaigns={campaigns} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vertical column for campaigns taking up more space */}
          <div className="lg:col-span-2 space-y-6">
            <CampaignSummaryCards campaigns={campaigns} />
            <ActiveCampaigns campaigns={campaigns} />
          </div>
          
          <div className="space-y-6">
            <LeaderboardSection campaigns={campaigns} />
            <AiInsights />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
