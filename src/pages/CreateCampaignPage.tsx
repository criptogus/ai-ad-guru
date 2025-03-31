
import React, { useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { CampaignProvider } from "@/contexts/CampaignContext";
import CampaignContent from "@/components/campaign/CampaignContent";

const CreateCampaignPage: React.FC = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  
  return (
    <AppLayout activePage="create-campaign">
      <div className="max-w-6xl mx-auto">
        <CampaignProvider>
          <CampaignContent />
        </CampaignProvider>
      </div>
    </AppLayout>
  );
};

export default CreateCampaignPage;
