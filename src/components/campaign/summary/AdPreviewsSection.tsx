
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
  linkedInAds: MetaAd[];
  websiteUrl: string;
  analysisResult: WebsiteAnalysisResult;
  selectedPlatforms: string[];
}

const AdPreviewsSection: React.FC<AdPreviewsSectionProps> = ({
  platform,
  googleAds,
  metaAds,
  microsoftAds,
  linkedInAds,
  websiteUrl,
  analysisResult,
  selectedPlatforms
}) => {
  // Only show this platform if it's in the selectedPlatforms
  if (!selectedPlatforms.includes(platform)) {
    return null;
  }

  // Get domain from website URL
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  const domain = getDomain(websiteUrl);
  const companyName = analysisResult?.companyName || "Sua Empresa";

  // Placeholder function for onGenerateImage
  const handleGenerateImage = () => {
    console.log("Image generation not implemented in this component");
  };

  // Get ads based on platform
  const renderPlatformAds = () => {
    switch (platform) {
      case "google":
        return googleAds.length > 0 ? (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Anúncios do Google ({googleAds.length})</h3>
            <div className="grid grid-cols-1 gap-4">
              {googleAds.map((ad, index) => (
                <div key={`google-ad-${index}`} className="border rounded-md p-4">
                  <GoogleAdPreview ad={ad} domain={domain} />
                </div>
              ))}
            </div>
          </div>
        ) : null;
      
      case "meta":
        return metaAds.length > 0 ? (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Anúncios do Instagram ({metaAds.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {metaAds.map((ad, index) => (
                <div key={`meta-ad-${index}`} className="border rounded-md p-4 flex justify-center">
                  <InstagramPreview 
                    ad={ad} 
                    companyName={companyName} 
                    index={index}
                    onGenerateImage={handleGenerateImage}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null;
      
      case "microsoft":
        return microsoftAds.length > 0 ? (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Anúncios do Microsoft Ads ({microsoftAds.length})</h3>
            <div className="grid grid-cols-1 gap-4">
              {microsoftAds.map((ad, index) => (
                <div key={`microsoft-ad-${index}`} className="border rounded-md p-4">
                  <MicrosoftAdPreview ad={ad} domain={domain} />
                </div>
              ))}
            </div>
          </div>
        ) : null;
      
      case "linkedin":
        return linkedInAds.length > 0 ? (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Anúncios do LinkedIn ({linkedInAds.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {linkedInAds.map((ad, index) => (
                <div key={`linkedin-ad-${index}`} className="border rounded-md p-4 flex justify-center">
                  <LinkedInAdPreview ad={ad} analysisResult={analysisResult} />
                </div>
              ))}
            </div>
          </div>
        ) : null;
      
      default:
        return null;
    }
  };

  return renderPlatformAds();
};

export default AdPreviewsSection;
