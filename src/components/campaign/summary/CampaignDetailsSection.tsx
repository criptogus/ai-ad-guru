
import React from "react";

interface CampaignDetailsSectionProps {
  campaignName: string;
  platform: string;
  budget: number;
  budgetType: string;
  startDate: string;
  endDate: string;
  objective: string;
  websiteUrl: string;
}

const CampaignDetailsSection: React.FC<CampaignDetailsSectionProps> = ({
  campaignName,
  platform,
  budget,
  budgetType,
  startDate,
  endDate,
  objective,
  websiteUrl,
}) => {
  // Extract domain from websiteUrl
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Campaign Details</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Name:</span>
          <span className="font-medium">{campaignName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Platform:</span>
          <span className="font-medium">
            {platform === 'google' ? 'Google Ads' : 
             platform === 'meta' ? 'Instagram Ads' : 'Microsoft Ads'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Budget:</span>
          <span className="font-medium">${budget} ({budgetType})</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Duration:</span>
          <span className="font-medium">{startDate} to {endDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Objective:</span>
          <span className="font-medium">{objective}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Website:</span>
          <span className="font-medium">{getDomain(websiteUrl)}</span>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsSection;
