
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CampaignSummaryCards from '@/components/dashboard/CampaignSummaryCards';
import BusinessOverview from '@/components/dashboard/BusinessOverview';
import LeaderboardSection from '@/components/dashboard/LeaderboardSection';
import SmartNotifications from '@/components/dashboard/SmartNotifications';
import CreditsStatus from '@/components/dashboard/CreditsStatus';
import { Campaign } from '@/models/CampaignTypes';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Sample campaigns data (in real app, this would come from API/context)
  const campaigns: Campaign[] = [
    // ... mock campaign data would go here
  ];
  
  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 gap-6 mb-8">
        <SmartNotifications />
      </div>
      
      {/* Credits Status Card */}
      <div className="mb-8">
        <CreditsStatus user={user} />
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-8">
        <CampaignSummaryCards campaigns={campaigns} />
      </div>
      
      <LeaderboardSection campaigns={campaigns} />
      
      <BusinessOverview campaigns={campaigns} />
    </div>
  );
};

export default Dashboard;
