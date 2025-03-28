
import React from "react";
import { format } from "date-fns";

interface CampaignDetailsSectionProps {
  campaignName: string;
  platform: string;
  budget: number;
  budgetType: string;
  startDate: string | Date;
  endDate: string | Date | null | undefined;
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

  // Format dates to strings if they are Date objects
  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "N/A";
    if (date instanceof Date) {
      return format(date, "MMM d, yyyy");
    }
    return date;
  };

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate) || "Ongoing";

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
          <span className="font-medium">{platform}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Budget:</span>
          <span className="font-medium">${budget} ({budgetType})</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Duration:</span>
          <span className="font-medium">{formattedStartDate} to {formattedEndDate}</span>
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
