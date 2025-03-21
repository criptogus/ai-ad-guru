
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CampaignActionFooterProps {
  platform?: string;
  onApprove: () => Promise<void>;
  onEdit: () => void;
  isLoading: boolean;
}

const CampaignActionFooter: React.FC<CampaignActionFooterProps> = ({
  platform,
  onApprove,
  onEdit,
  isLoading
}) => {
  const handleApprove = async () => {
    await onApprove();
  };

  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={onEdit}>
        Edit Campaign
      </Button>
      <Button 
        onClick={handleApprove} 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Campaign...
          </>
        ) : (
          <>Launch Campaign</>
        )}
      </Button>
    </div>
  );
};

export default CampaignActionFooter;
