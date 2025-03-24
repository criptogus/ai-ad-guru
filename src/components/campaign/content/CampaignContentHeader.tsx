
import React from "react";
import CampaignHeader from "../CampaignHeader";
import { InstaAdTestLink } from "@/components/testing/meta";

interface CampaignContentHeaderProps {
  onBack: () => void;
  currentStep: number;
}

const CampaignContentHeader: React.FC<CampaignContentHeaderProps> = ({
  onBack,
  currentStep
}) => {
  return (
    <div className="flex justify-between items-center">
      <CampaignHeader 
        onBack={onBack} 
        step={currentStep} 
        currentStep={currentStep} 
      />
      <InstaAdTestLink />
    </div>
  );
};

export default CampaignContentHeader;
