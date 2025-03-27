
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CampaignHeaderProps {
  onBack?: () => void; // Made optional with '?'
  step?: number;
  currentStep?: number;
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({ onBack = () => {}, step, currentStep }) => {
  // Use either step or currentStep, prioritizing step if both are provided
  const activeStep = step || currentStep || 1;
  
  const getTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Website Analysis";
      case 2:
        return "Select Ad Platforms";
      case 3:
        return "Campaign Setup";
      case 4:
        return "Audience Analysis";
      case 5:
        return "Campaign Setup";
      case 6:
        return "Ad Preview & Customization";
      case 7:
        return "Campaign Summary";
      default:
        return "Create Campaign";
    }
  };

  return (
    <div className="flex items-center">
      {onBack && (
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft size={20} />
        </Button>
      )}
      <div>
        <h1 className="text-2xl font-bold">{getTitle(activeStep)}</h1>
        <p className="text-sm text-muted-foreground">Create a new ad campaign</p>
      </div>
    </div>
  );
};

export default CampaignHeader;
