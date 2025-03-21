import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import CampaignDetailsSection from "./summary/CampaignDetailsSection";
import AudienceTargetingSection from "./summary/AudienceTargetingSection";
import AdPreviewsSection from "./summary/AdPreviewsSection";
import CampaignActionFooter from "./summary/CampaignActionFooter";

interface CampaignSummaryProps {
  campaignName: string;
  platform?: string;
  platforms?: string[];
  budget: number;
  budgetType: string;
  startDate: string;
  endDate: string;
  objective: string;
  targetAudience: string;
  websiteUrl: string;
  analysisResult: WebsiteAnalysisResult;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  microsoftAds: any[];
  onApprove: () => void;
  onEdit: () => void;
  isLoading: boolean;
}

const CampaignSummary: React.FC<CampaignSummaryProps> = ({
  campaignName,
  platform,
  platforms = [],
  budget,
  budgetType,
  startDate,
  endDate,
  objective,
  targetAudience,
  websiteUrl,
  analysisResult,
  googleAds,
  metaAds,
  microsoftAds,
  onApprove,
  onEdit,
  isLoading
}) => {
  const getPlatformNames = (platformIds: string[]) => {
    const platformMap: Record<string, string> = {
      google: "Google Ads",
      meta: "Instagram (Meta)",
      linkedin: "LinkedIn",
      microsoft: "Microsoft Ads"
    };
    
    return platformIds.map(id => platformMap[id] || id).join(", ");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Summary</CardTitle>
        <CardDescription>
          Review your campaign details before launching
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <CampaignDetailsSection
              name={campaignName}
              platforms={platforms.length > 0 ? getPlatformNames(platforms) : platform || "Not specified"}
              budget={budget}
              budgetType={budgetType}
              startDate={startDate}
              endDate={endDate}
              objective={objective}
            />
            <AudienceTargetingSection 
              targetAudience={targetAudience}
              websiteUrl={websiteUrl}
              keywords={analysisResult.keywords || []}
            />
          </div>

          <Separator />

          <AdPreviewsSection
            platform={platform}
            googleAds={googleAds}
            metaAds={metaAds}
            microsoftAds={microsoftAds}
            websiteUrl={websiteUrl}
            analysisResult={analysisResult}
          />

          <Separator />

          <CampaignActionFooter
            platform={platform}
            onApprove={onApprove}
            onEdit={onEdit}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignSummary;
