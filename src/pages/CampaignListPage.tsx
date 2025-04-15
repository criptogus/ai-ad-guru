
import React from 'react';
import AppLayout from '@/components/AppLayout';

const CampaignListPage: React.FC = () => {
  return (
    <AppLayout activePage="campaigns">
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-6">Your Campaigns</h1>
        <div className="grid gap-4">
          <div className="p-8 text-center border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No campaigns yet</p>
            <a href="/create-campaign" className="text-primary hover:underline">
              Create your first campaign
            </a>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CampaignListPage;
