
import React from "react";
import AppLayout from "@/components/AppLayout";
import { CampaignProvider } from "@/contexts/CampaignContext";
import CampaignContent from "@/components/campaign/CampaignContent";

const CreateCampaignPage: React.FC = () => {
  return (
    <AppLayout activePage="campaigns">
      <CampaignProvider>
        <CampaignContent />
      </CampaignProvider>
    </AppLayout>
  );
};

export default CreateCampaignPage;
