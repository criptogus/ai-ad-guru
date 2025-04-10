
import React, { useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { CampaignProvider } from "@/contexts/CampaignContext";
import CampaignContent from "@/components/campaign/CampaignContent";

const CreateCampaignPage: React.FC = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log("CreateCampaignPage mounted"); // Add logging to debug
  }, []);
  
  return (
    <AppLayout activePage="create-campaign">
      <div className="w-full">
        <div className="px-6 py-6 max-w-6xl mx-auto">
          <CampaignProvider>
            <CampaignContent />
          </CampaignProvider>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateCampaignPage;
