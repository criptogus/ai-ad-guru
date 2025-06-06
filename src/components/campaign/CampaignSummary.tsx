
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import AdPreviewsSection from "./summary/AdPreviewsSection";

interface CampaignSummaryProps {
  campaignName: string;
  platform?: string;
  platforms: string[]; // Array of all selected platforms
  budget: number;
  budgetType: "daily" | "lifetime";
  startDate: string;
  endDate?: string;
  objective: string;
  targetAudience: string;
  websiteUrl: string;
  analysisResult: WebsiteAnalysisResult;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  microsoftAds: GoogleAd[];
  linkedInAds?: MetaAd[];
  onApprove: () => Promise<void>;
  onEdit: () => void;
  isLoading: boolean;
}

const CampaignSummary: React.FC<CampaignSummaryProps> = ({
  campaignName,
  platform,
  platforms,
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
  linkedInAds = [],
  onApprove,
  onEdit,
  isLoading,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Resumo da Campanha</CardTitle>
        <CardDescription>
          Revise os detalhes da sua campanha antes de finalizar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold mb-2">Detalhes da Campanha</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nome da Campanha:</span>
                <span className="font-medium">{campaignName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Orçamento:</span>
                <span className="font-medium">${budget} {budgetType === 'daily' ? 'diário' : 'total'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data de Início:</span>
                <span className="font-medium">{startDate}</span>
              </div>
              {endDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data de Término:</span>
                  <span className="font-medium">{endDate}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Objetivo:</span>
                <span className="font-medium">{objective}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Website:</span>
                <span className="font-medium">{websiteUrl}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Plataformas</h3>
            <div className="space-y-2">
              {platforms.map((platformId, index) => (
                <div key={index} className="flex items-center">
                  <span className="font-medium capitalize">{platformId} Ads</span>
                  {platformId === 'google' && googleAds.length > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">({googleAds.length} variações)</span>
                  )}
                  {platformId === 'meta' && metaAds.length > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">({metaAds.length} variações)</span>
                  )}
                  {platformId === 'linkedin' && linkedInAds.length > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">({linkedInAds.length} variações)</span>
                  )}
                  {platformId === 'microsoft' && microsoftAds.length > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">({microsoftAds.length} variações)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Público-Alvo</h3>
          <p>{targetAudience}</p>
        </div>

        {/* Display ad previews for each platform with ads */}
        <div className="space-y-6 border-t pt-4">
          {platforms.map((platformId) => (
            <div key={platformId}>
              {/* Only render the section if the platform has ads */}
              {(platformId === 'google' && googleAds.length > 0) && (
                <AdPreviewsSection
                  platform="google"
                  googleAds={googleAds}
                  metaAds={metaAds}
                  microsoftAds={microsoftAds}
                  linkedInAds={linkedInAds}
                  websiteUrl={websiteUrl}
                  analysisResult={analysisResult}
                  selectedPlatforms={platforms}
                />
              )}
              {(platformId === 'meta' && metaAds.length > 0) && (
                <AdPreviewsSection
                  platform="meta"
                  googleAds={googleAds}
                  metaAds={metaAds}
                  microsoftAds={microsoftAds}
                  linkedInAds={linkedInAds}
                  websiteUrl={websiteUrl}
                  analysisResult={analysisResult}
                  selectedPlatforms={platforms}
                />
              )}
              {(platformId === 'linkedin' && linkedInAds.length > 0) && (
                <AdPreviewsSection
                  platform="linkedin"
                  googleAds={googleAds}
                  metaAds={metaAds}
                  microsoftAds={microsoftAds}
                  linkedInAds={linkedInAds}
                  websiteUrl={websiteUrl}
                  analysisResult={analysisResult}
                  selectedPlatforms={platforms}
                />
              )}
              {(platformId === 'microsoft' && microsoftAds.length > 0) && (
                <AdPreviewsSection
                  platform="microsoft"
                  googleAds={googleAds}
                  metaAds={metaAds}
                  microsoftAds={microsoftAds}
                  linkedInAds={linkedInAds}
                  websiteUrl={websiteUrl}
                  analysisResult={analysisResult}
                  selectedPlatforms={platforms}
                />
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t flex justify-between">
          <Button variant="outline" onClick={onEdit}>
            Editar Campanha
          </Button>
          <Button onClick={onApprove} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> Criando...
              </>
            ) : (
              "Criar Campanha"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignSummary;
