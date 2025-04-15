
import React from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';

const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <AppLayout activePage="campaigns">
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-6">Campaign Details</h1>
        <div className="p-4 bg-muted rounded-lg">
          <p>Campaign ID: {id}</p>
          <p className="text-muted-foreground mt-2">
            Campaign details will be shown here
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default CampaignDetailPage;
