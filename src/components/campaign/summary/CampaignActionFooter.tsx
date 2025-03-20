
import React from "react";
import { Button } from "@/components/ui/button";

interface CampaignActionFooterProps {
  platform: string;
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
  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-muted-foreground">
        By approving, your campaign will be prepared for launch to 
        {platform === 'google' ? ' Google Ads' : 
         platform === 'meta' ? ' Instagram Ads' : ' Microsoft Ads'}.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onEdit}>
          Edit Campaign
        </Button>
        <Button onClick={onApprove} disabled={isLoading}>
          {isLoading ? "Processing..." : "Approve & Launch"}
        </Button>
      </div>
    </div>
  );
};

export default CampaignActionFooter;
