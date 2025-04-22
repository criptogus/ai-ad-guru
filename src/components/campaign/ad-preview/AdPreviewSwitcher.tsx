import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import GoogleAdPreview from "./google/GoogleAdPreview";
import MicrosoftAdPreview from "./microsoft/MicrosoftAdPreview";
import LinkedInAdPreview from "./linkedin/LinkedInAdPreview";
import { InstagramPreview } from "./meta/instagram-preview";
import { Card, CardContent } from "@/components/ui/card";
import { getDomain } from "@/lib/utils";

interface AdPreviewSwitcherProps {
  analysisResult: WebsiteAnalysisResult;
  googleAd?: GoogleAd;
  metaAd?: MetaAd;
  microsoftAd?: GoogleAd;
  linkedInAd?: MetaAd;
  initialTab?: string;
  className?: string;
}

const AdPreviewSwitcher: React.FC<AdPreviewSwitcherProps> = ({
  analysisResult,
  googleAd,
  metaAd,
  microsoftAd,
  linkedInAd,
  initialTab = "google",
  className
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [instagramView, setInstagramView] = useState<"feed" | "story">("feed");
  
  const domain = getDomain(analysisResult.websiteUrl || "example.com");
  
  const defaultGoogleAd: GoogleAd = {
    headline1: "Your Main Headline Here",
    headline2: "Secondary Headline",
    headline3: "Final Call to Action",
    description1: "This is the first description line that explains what your product or service does and why people should care.",
    description2: "This is the second description line with additional details about features, benefits, or special offers.",
    path1: "services",
    path2: "offers",
    headlines: ["Your Main Headline Here", "Secondary Headline", "Final Call to Action"],
    descriptions: [
      "This is the first description line that explains what your product or service does and why people should care.",
      "This is the second description line with additional details about features, benefits, or special offers."
    ],
    siteLinks: []
  };
  
  const defaultMetaAd: MetaAd = {
    headline: "Discover Our Product",
    primaryText: "Transform your daily routine with our innovative solution. Designed for maximum efficiency and built to last. ✨ #Innovation #Quality",
    description: "Shop Now",
    imagePrompt: "A professional lifestyle product image with clean background and modern aesthetic"
  };

  const googleAdToDisplay = googleAd || defaultGoogleAd;
  const metaAdToDisplay = metaAd || defaultMetaAd;
  const microsoftAdToDisplay = microsoftAd || defaultGoogleAd;
  const linkedInAdToDisplay = linkedInAd || defaultMetaAd;

  const handleGenerateImage = async (): Promise<void> => {
    console.log("Image generation requested but not implemented in this component");
    return Promise.resolve();
  };

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 bg-background border-b rounded-none p-0 h-auto">
            <TabsTrigger 
              value="google" 
              className="py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              Google Ads
            </TabsTrigger>
            <TabsTrigger 
              value="instagram" 
              className="py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              Instagram Ads
            </TabsTrigger>
            <TabsTrigger 
              value="linkedin" 
              className="py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              LinkedIn Ads
            </TabsTrigger>
            <TabsTrigger 
              value="microsoft" 
              className="py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              Microsoft Ads
            </TabsTrigger>
          </TabsList>
          
          <div className="p-6">
            <TabsContent value="google" className="mt-0">
              <div className="flex justify-center">
                <GoogleAdPreview ad={googleAdToDisplay} domain={domain} />
              </div>
            </TabsContent>
            
            <TabsContent value="instagram" className="mt-0">
              <div className="flex flex-col items-center">
                <div className="mb-4 flex justify-center space-x-4">
                  <button 
                    className={`px-4 py-2 rounded-full text-sm font-medium ${instagramView === 'feed' ? 'bg-gray-200 text-gray-800' : 'bg-transparent text-gray-500'}`}
                    onClick={() => setInstagramView('feed')}
                  >
                    Feed Post
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-full text-sm font-medium ${instagramView === 'story' ? 'bg-gray-200 text-gray-800' : 'bg-transparent text-gray-500'}`}
                    onClick={() => setInstagramView('story')}
                  >
                    Story
                  </button>
                </div>
                
                <InstagramPreview 
                  ad={metaAdToDisplay} 
                  companyName={analysisResult.companyName || "Company Name"} 
                  viewMode={instagramView}
                  index={0}
                  onGenerateImage={handleGenerateImage}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="linkedin" className="mt-0">
              <div className="flex justify-center">
                <LinkedInAdPreview 
                  ad={linkedInAdToDisplay} 
                  analysisResult={analysisResult} 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="microsoft" className="mt-0">
              <div className="flex justify-center">
                <MicrosoftAdPreview ad={microsoftAdToDisplay} domain={domain} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdPreviewSwitcher;
