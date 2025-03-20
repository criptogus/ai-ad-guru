
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
  platform: string;
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
  microsoftAds: GoogleAd[];
  onApprove: () => Promise<void>;
  onEdit: () => void;
  isLoading: boolean;
}

const CampaignSummary: React.FC<CampaignSummaryProps> = ({
  campaignName,
  platform,
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
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Campaign Summary</CardTitle>
        <CardDescription>
          Review your campaign details before launching
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CampaignDetailsSection
            campaignName={campaignName}
            platform={platform}
            budget={budget}
            budgetType={budgetType}
            startDate={startDate}
            endDate={endDate}
            objective={objective}
            websiteUrl={websiteUrl}
          />
          
          <AudienceTargetingSection
            targetAudience={targetAudience}
            analysisResult={analysisResult}
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
      </CardContent>
    </Card>
  );
};

export default CampaignSummary;
