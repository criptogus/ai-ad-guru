
import React from "react";
import { format } from "date-fns";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface CampaignDetailsSectionProps {
  campaignData: {
    name?: string;
    description?: string;
    targetUrl?: string;
    objective?: string;
    platforms?: string[];
  };
  analysisResult: WebsiteAnalysisResult;
}

const CampaignDetailsSection: React.FC<CampaignDetailsSectionProps> = ({
  campaignData,
  analysisResult,
}) => {
  // Extract domain from websiteUrl
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  // Get platform names as comma-separated string
  const getPlatformNames = (platforms: string[] = []) => {
    if (platforms.length === 0) return "None";
    return platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(", ");
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Campaign Details</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Name:</span>
          <span className="font-medium">{campaignData.name || "New Campaign"}</span>
        </div>
        {campaignData.platforms && campaignData.platforms.length > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platforms:</span>
            <span className="font-medium">{getPlatformNames(campaignData.platforms)}</span>
          </div>
        )}
        {campaignData.objective && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Objective:</span>
            <span className="font-medium">{campaignData.objective}</span>
          </div>
        )}
        {campaignData.targetUrl && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Website:</span>
            <span className="font-medium">{getDomain(campaignData.targetUrl)}</span>
          </div>
        )}
        {campaignData.description && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Description:</span>
            <span className="font-medium truncate max-w-[250px]" title={campaignData.description}>
              {campaignData.description.length > 50 
                ? `${campaignData.description.substring(0, 50)}...` 
                : campaignData.description}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetailsSection;
