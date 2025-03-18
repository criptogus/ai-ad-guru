
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CampaignHeaderProps {
  onBack: () => void;
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({ onBack }) => {
  return (
    <div className="flex items-center mb-8">
      <Button variant="ghost" className="mr-2" onClick={onBack}>
        <ArrowLeft size={16} />
      </Button>
      <div>
        <h1 className="text-3xl font-bold">Create Campaign</h1>
        <p className="text-muted-foreground">Let AI help you create a high-converting ad campaign</p>
      </div>
    </div>
  );
};

export default CampaignHeader;
