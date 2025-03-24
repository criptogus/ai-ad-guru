
import React from "react";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import GoogleAdPreview from "../ad-preview/google/GoogleAdPreview";
import { InstagramPreview } from "../ad-preview/meta";
import { MicrosoftAdPreview } from "../ad-preview/microsoft";
import LinkedInAdPreview from "../ad-preview/linkedin/LinkedInAdPreview";

interface AdPreviewsSectionProps {
  platform: string;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  microsoftAds: GoogleAd[];
  linkedInAds?: MetaAd[];
  websiteUrl: string;
  analysisResult: WebsiteAnalysisResult;
}

const AdPreviewsSection: React.FC<AdPreviewsSectionProps> = ({
  platform,
  googleAds,
  metaAds,
  microsoftAds,
  linkedInAds = [],
  websiteUrl,
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
      
      case 'linkedin':
        return linkedInAds.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-md font-medium">LinkedIn Ads</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {linkedInAds.slice(0, 2).map((ad, index) => (
                <div key={index} className="border rounded-md p-2">
                  <LinkedInAdPreview 
                    ad={ad}
                    analysisResult={analysisResult}
                    imageFormat="landscape"
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
    <div>
      <h3 className="text-lg font-semibold mb-2">Ad Previews</h3>
      {getAdPreviews()}
    </div>
  );
};

export default AdPreviewsSection;
