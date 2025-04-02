
import React from "react";
import CampaignSummaryCards from "@/components/dashboard/CampaignSummaryCards";
import { Campaign } from "@/models/CampaignTypes";

interface CampaignsTabContentProps {
  campaigns: Campaign[];
}

const CampaignsTabContent: React.FC<CampaignsTabContentProps> = ({ campaigns }) => {
  return (
    <div className="space-y-6 w-full">
      <CampaignSummaryCards campaigns={campaigns} />
    </div>
  );
};

export default CampaignsTabContent;
