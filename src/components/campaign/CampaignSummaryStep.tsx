
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import AdPreviewsSection from "./summary/AdPreviewsSection";
import CampaignDetailsSection from "./summary/CampaignDetailsSection";
import CampaignBudgetSection from "./summary/CampaignBudgetSection";

interface CampaignSummaryStepProps {
  campaignData: {
    name: string;
    description: string;
    targetUrl: string;
    platforms: string[];
    budget?: number;
    budgetType?: "daily" | "lifetime";
    startDate?: string;
    endDate?: string;
    objective?: string;
    mindTriggers?: Record<string, string>;
  };
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  microsoftAds: GoogleAd[];
  linkedInAds: MetaAd[];
  analysisResult: WebsiteAnalysisResult;
  isCreating: boolean;
  onBack: () => void;
  onCreateCampaign: () => void;
}

const CampaignSummaryStep: React.FC<CampaignSummaryStepProps> = ({
  campaignData,
  googleAds,
  metaAds,
  microsoftAds,
  linkedInAds,
  analysisResult,
  isCreating,
  onBack,
  onCreateCampaign
}) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold">Resumo da Campanha</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <CampaignDetailsSection 
          campaignData={campaignData}
          analysisResult={analysisResult}
        />
        
        <CampaignBudgetSection 
          budget={campaignData.budget}
          budgetType={campaignData.budgetType}
          startDate={campaignData.startDate}
          endDate={campaignData.endDate}
        />
        
        {/* Only show ad previews for the selected platforms */}
        {campaignData.platforms.includes('google') && (
          <AdPreviewsSection
            platform="google"
            googleAds={googleAds}
            metaAds={metaAds}
            microsoftAds={microsoftAds}
            linkedInAds={linkedInAds}
            websiteUrl={campaignData.targetUrl}
            analysisResult={analysisResult}
            selectedPlatforms={campaignData.platforms}
          />
        )}
        
        {campaignData.platforms.includes('meta') && (
          <AdPreviewsSection
            platform="meta"
            googleAds={googleAds}
            metaAds={metaAds}
            microsoftAds={microsoftAds}
            linkedInAds={linkedInAds}
            websiteUrl={campaignData.targetUrl}
            analysisResult={analysisResult}
            selectedPlatforms={campaignData.platforms}
          />
        )}
        
        {campaignData.platforms.includes('microsoft') && (
          <AdPreviewsSection
            platform="microsoft"
            googleAds={googleAds}
            metaAds={metaAds}
            microsoftAds={microsoftAds}
            linkedInAds={linkedInAds}
            websiteUrl={campaignData.targetUrl}
            analysisResult={analysisResult}
            selectedPlatforms={campaignData.platforms}
          />
        )}
        
        {campaignData.platforms.includes('linkedin') && (
          <AdPreviewsSection
            platform="linkedin"
            googleAds={googleAds}
            metaAds={metaAds}
            microsoftAds={microsoftAds}
            linkedInAds={linkedInAds}
            websiteUrl={campaignData.targetUrl}
            analysisResult={analysisResult}
            selectedPlatforms={campaignData.platforms}
          />
        )}
        
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button onClick={onCreateCampaign} disabled={isCreating}>
            {isCreating ? "Criando..." : "Criar Campanha"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignSummaryStep;
