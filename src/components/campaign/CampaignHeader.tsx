
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CampaignHeaderProps {
  onBack: () => void;
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({ onBack }) => {
  return (
    <div className="flex items-center mb-8 bg-accent/50 p-6 rounded-lg shadow-sm">
      <Button variant="ghost" className="mr-4" onClick={onBack}>
        <ArrowLeft size={16} />
      </Button>
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Campaign</h1>
        <p className="text-muted-foreground mt-1">Let AI help you create a high-converting ad campaign</p>
      </div>
    </div>
  );
};

export default CampaignHeader;
