
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleAd, MetaAd } from '@/hooks/adGeneration';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import GoogleAdPreview from './google/GoogleAdPreview';
import { InstagramPreview } from './meta';
import LinkedInAdPreview from './linkedin/LinkedInAdPreview';
import { MicrosoftAdPreview } from './microsoft';

interface AdPreviewSwitcherProps {
  analysisResult?: WebsiteAnalysisResult;
  googleAd?: GoogleAd;
  metaAd?: MetaAd;
  microsoftAd?: GoogleAd;
  linkedInAd?: MetaAd;
  isLoading?: boolean;
  onGenerateImage?: () => Promise<void>;
}

const AdPreviewSwitcher: React.FC<AdPreviewSwitcherProps> = ({
  analysisResult,
  googleAd,
  metaAd,
  microsoftAd,
  linkedInAd,
  isLoading = false,
  onGenerateImage
}) => {
  const [activeTab, setActiveTab] = useState<string>('google');
  
  // Get domain from website URL
  const getDomain = (url?: string) => {
    if (!url) return 'example.com';
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  };
  
  // Create a placeholder image generation function that returns a Promise
  const handleGenerateImage = async (): Promise<void> => {
    if (onGenerateImage) {
      return onGenerateImage();
    }
    return Promise.resolve();
  };
  
  const domain = getDomain(analysisResult?.websiteUrl);
  const companyName = analysisResult?.companyName || "Your Company";
  
  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        {googleAd && <TabsTrigger value="google">Google</TabsTrigger>}
        {metaAd && <TabsTrigger value="instagram">Instagram</TabsTrigger>}
        {linkedInAd && <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>}
        {microsoftAd && <TabsTrigger value="microsoft">Microsoft</TabsTrigger>}
      </TabsList>
      
      {googleAd && (
        <TabsContent value="google" className="flex justify-center">
          <div className="max-w-lg">
            <GoogleAdPreview 
              ad={googleAd}
              domain={domain}
            />
          </div>
        </TabsContent>
      )}
      
      {metaAd && (
        <TabsContent value="instagram" className="flex justify-center">
          <InstagramPreview 
            ad={metaAd}
            companyName={companyName}
            onGenerateImage={handleGenerateImage}
          />
        </TabsContent>
      )}
      
      {linkedInAd && (
        <TabsContent value="linkedin" className="flex justify-center">
          <LinkedInAdPreview 
            ad={linkedInAd}
            analysisResult={analysisResult}
          />
        </TabsContent>
      )}
      
      {microsoftAd && (
        <TabsContent value="microsoft" className="flex justify-center">
          <div className="max-w-lg">
            <MicrosoftAdPreview 
              ad={microsoftAd}
              domain={domain}
            />
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default AdPreviewSwitcher;
