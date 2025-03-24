
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
  microsoftAds: any[];
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
        <CardTitle>Campaign Summary</CardTitle>
        <CardDescription>
          Review your campaign details before finalizing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold mb-2">Campaign Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Campaign Name:</span>
                <span className="font-medium">{campaignName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Budget:</span>
                <span className="font-medium">${budget} {budgetType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Date:</span>
                <span className="font-medium">{startDate}</span>
              </div>
              {endDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date:</span>
                  <span className="font-medium">{endDate}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Objective:</span>
                <span className="font-medium">{objective}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Website:</span>
                <span className="font-medium">{websiteUrl}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Platforms</h3>
            <div className="space-y-2">
              {platforms.map((platformId, index) => (
                <div key={index} className="flex items-center">
                  <span className="font-medium capitalize">{platformId} Ads</span>
                  {platformId === 'google' && googleAds.length > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">({googleAds.length} variations)</span>
                  )}
                  {platformId === 'meta' && metaAds.length > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">({metaAds.length} variations)</span>
                  )}
                  {platformId === 'linkedin' && linkedInAds.length > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">({linkedInAds.length} variations)</span>
                  )}
                  {platformId === 'microsoft' && microsoftAds.length > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">({microsoftAds.length} variations)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Target Audience</h3>
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
                />
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t flex justify-between">
          <Button variant="outline" onClick={onEdit}>
            Edit Campaign
          </Button>
          <Button onClick={onApprove} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> Creating...
              </>
            ) : (
              "Create Campaign"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignSummary;
