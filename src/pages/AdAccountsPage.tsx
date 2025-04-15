
import React from 'react';
import AppLayout from '@/components/AppLayout';

const AdAccountsPage: React.FC = () => {
  return (
    <AppLayout activePage="ad-accounts">
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-6">Ad Accounts</h1>
        <div className="grid gap-4">
          <div className="p-8 text-center border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">Connect your ad accounts to get started</p>
            <button className="text-primary hover:underline">
              Connect Ad Account
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdAccountsPage;
