
import React from "react";
import { GoogleAd, MetaAd, MicrosoftAd } from "@/hooks/adGeneration/types";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import GoogleAdPreview from "../ad-preview/google/GoogleAdPreview";
import { InstagramPreview } from "../ad-preview/meta";
import { MicrosoftAdPreview } from "../ad-preview/microsoft";
import LinkedInAdPreview from "../ad-preview/linkedin/LinkedInAdPreview";
import { normalizeGoogleAd, normalizeMetaAd, getDomain } from "@/lib/utils";

interface AdPreviewsSectionProps {
  platform: string;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  microsoftAds: GoogleAd[];
  linkedInAds?: MetaAd[];
  websiteUrl: string;
  analysisResult: WebsiteAnalysisResult;
  selectedPlatforms?: string[]; // Add this prop to control which platforms to show
}

const AdPreviewsSection: React.FC<AdPreviewsSectionProps> = ({
  platform,
  googleAds,
  metaAds,
  microsoftAds,
  linkedInAds = [],
  websiteUrl,
  analysisResult,
  selectedPlatforms = [], // Default to empty array if not provided
}) => {
  // Extract domain from websiteUrl using the utility function
  const domain = getDomain(websiteUrl);

  // Check if this platform is selected by the user
  const isPlatformSelected = (platformName: string) => {
    // If no platforms are explicitly selected, show all (for backward compatibility)
    if (!selectedPlatforms || selectedPlatforms.length === 0) {
      return true;
    }
    return selectedPlatforms.includes(platformName);
  };

  // Get the appropriate ads to display based on platform
  const getAdPreviews = () => {
    // For the specific platform being viewed, always show it regardless of selection
    switch(platform) {
      case 'google':
        return isPlatformSelected('google') && googleAds.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-md font-medium">Google Ads</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {googleAds.slice(0, 2).map((ad, index) => (
                <div key={index} className="border rounded-md p-2">
                  <GoogleAdPreview ad={ad} domain={domain} />
                </div>
              ))}
            </div>
          </div>
        ) : null;
      
      case 'meta':
        return isPlatformSelected('meta') && metaAds.length > 0 ? (
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
        return isPlatformSelected('linkedin') && linkedInAds.length > 0 ? (
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
        return isPlatformSelected('microsoft') && microsoftAds.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-md font-medium">Microsoft Ads</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {microsoftAds.slice(0, 2).map((ad, index) => {
                // Always normalize Microsoft ads
                const normalizedAd = normalizeGoogleAd(ad);
                return (
                  <div key={index} className="border rounded-md p-2">
                    <MicrosoftAdPreview ad={normalizedAd} domain={domain} />
                  </div>
                );
              })}
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
