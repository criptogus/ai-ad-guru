
import React from "react";
import SafeAppLayout from "@/components/SafeAppLayout";
import { CampaignProvider } from "@/contexts/CampaignContext";
import CampaignContent from "@/components/campaign/CampaignContent";

const CreateCampaignPage: React.FC = () => {
  return (
    <SafeAppLayout activePage="campaigns">
      <CampaignProvider>
        <CampaignContent />
      </CampaignProvider>
    </SafeAppLayout>
  );
};

export default CreateCampaignPage;
