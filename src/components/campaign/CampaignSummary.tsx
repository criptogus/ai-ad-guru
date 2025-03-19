
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { useNavigate } from "react-router-dom";
import GoogleAdPreview from "./ad-preview/google/GoogleAdPreview";
import { InstagramPreview } from "./ad-preview/meta";
import { MicrosoftAdPreview } from "./ad-preview/microsoft";

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
  const navigate = useNavigate();
  
  // Extract domain from websiteUrl
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  // Helper to render keywords safely
  const renderKeywords = (keywords: string[] | string) => {
    if (Array.isArray(keywords)) {
      return keywords.map((keyword, idx) => (
        <span key={idx} className="bg-muted text-xs px-2 py-1 rounded">
          {keyword.trim()}
        </span>
      ));
    } else if (typeof keywords === 'string') {
      return keywords.split(",").map((keyword, idx) => (
        <span key={idx} className="bg-muted text-xs px-2 py-1 rounded">
          {keyword.trim()}
        </span>
      ));
    }
    return null;
  };

  // Get the appropriate ads to display based on platform
  const getAdPreviews = () => {
    switch(platform) {
      case 'google':
        return googleAds.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-md font-medium">Google Ads</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {googleAds.slice(0, 2).map((ad, index) => (
                <div key={index} className="border rounded-md p-2">
                  <GoogleAdPreview ad={ad} domain={getDomain(websiteUrl)} />
                </div>
              ))}
            </div>
          </div>
        ) : null;
      
      case 'meta':
        return metaAds.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-md font-medium">Instagram Ads</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metaAds.slice(0, 2).map((ad, index) => (
                <div key={index} className="border rounded-md p-2">
                  <InstagramPreview 
                    ad={ad}
                    companyName={analysisResult.companyName}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null;
      
      case 'microsoft':
        return microsoftAds.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-md font-medium">Microsoft Ads</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {microsoftAds.slice(0, 2).map((ad, index) => (
                <div key={index} className="border rounded-md p-2">
                  <MicrosoftAdPreview ad={ad} domain={getDomain(websiteUrl)} />
                </div>
              ))}
            </div>
          </div>
        ) : null;
      
      default:
        return null;
    }
  };

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
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Audience & Targeting</h3>
            <div className="space-y-2">
              <p className="text-sm">{targetAudience}</p>
              {analysisResult.keywords && (
                <div>
                  <span className="text-muted-foreground text-sm">Keywords:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {renderKeywords(analysisResult.keywords)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Ad Previews</h3>
          {getAdPreviews()}
        </div>
        
        <Separator />
        
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
      </CardContent>
    </Card>
  );
};

export default CampaignSummary;
