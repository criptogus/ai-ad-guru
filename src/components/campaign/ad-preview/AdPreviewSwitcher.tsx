
import React, { useState, useEffect } from 'react';
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
  selectedPlatforms?: string[];
}

const AdPreviewSwitcher: React.FC<AdPreviewSwitcherProps> = ({
  analysisResult,
  googleAd,
  metaAd,
  microsoftAd,
  linkedInAd,
  isLoading = false,
  onGenerateImage,
  selectedPlatforms = []
}) => {
  // Find the first available platform to use as default
  const getDefaultPlatform = (): string => {
    if (googleAd && isPlatformSelected('google')) return 'google';
    if (metaAd && isPlatformSelected('meta')) return 'instagram';
    if (linkedInAd && isPlatformSelected('linkedin')) return 'linkedin';
    if (microsoftAd && isPlatformSelected('microsoft')) return 'microsoft';
    return 'google'; // Default fallback
  };
  
  const [activeTab, setActiveTab] = useState<string>(getDefaultPlatform());
  
  // Update active tab if the current one becomes unavailable
  useEffect(() => {
    const isCurrentTabAvailable = 
      (activeTab === 'google' && googleAd && isPlatformSelected('google')) ||
      (activeTab === 'instagram' && metaAd && isPlatformSelected('meta')) ||
      (activeTab === 'linkedin' && linkedInAd && isPlatformSelected('linkedin')) ||
      (activeTab === 'microsoft' && microsoftAd && isPlatformSelected('microsoft'));
    
    if (!isCurrentTabAvailable) {
      setActiveTab(getDefaultPlatform());
    }
  }, [googleAd, metaAd, linkedInAd, microsoftAd, selectedPlatforms]);
  
  // Check if a platform is selected - THIS IS THE KEY FUNCTION TO FIX THE BUG
  const isPlatformSelected = (platform: string): boolean => {
    // If no platforms are specified, show all (for backward compatibility)
    if (!selectedPlatforms || selectedPlatforms.length === 0) return true;
    
    // Map the UI platform names to the platform IDs used in the selection
    if (platform === 'google') return selectedPlatforms.includes('google');
    if (platform === 'instagram' || platform === 'meta') return selectedPlatforms.includes('meta');
    if (platform === 'linkedin') return selectedPlatforms.includes('linkedin');
    if (platform === 'microsoft' || platform === 'bing') return selectedPlatforms.includes('microsoft');
    
    return false;
  };
  
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
  
  // Get available platforms based on data and selection
  const availablePlatforms = [
    { id: 'google', label: 'Google', available: !!googleAd && isPlatformSelected('google') },
    { id: 'instagram', label: 'Instagram', available: !!metaAd && isPlatformSelected('meta') },
    { id: 'linkedin', label: 'LinkedIn', available: !!linkedInAd && isPlatformSelected('linkedin') },
    { id: 'microsoft', label: 'Microsoft', available: !!microsoftAd && isPlatformSelected('microsoft') }
  ].filter(platform => platform.available);
  
  // If no platforms are available, show a message
  if (availablePlatforms.length === 0) {
    return <div className="text-center p-4 text-muted-foreground">No ad platforms selected or no ad data available.</div>;
  }
  
  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${availablePlatforms.length}, 1fr)` }}>
        {availablePlatforms.map(platform => (
          <TabsTrigger key={platform.id} value={platform.id}>{platform.label}</TabsTrigger>
        ))}
      </TabsList>
      
      {googleAd && isPlatformSelected('google') && (
        <TabsContent value="google" className="flex justify-center">
          <div className="max-w-lg">
            <GoogleAdPreview 
              ad={googleAd}
              domain={domain}
            />
          </div>
        </TabsContent>
      )}
      
      {metaAd && isPlatformSelected('meta') && (
        <TabsContent value="instagram" className="flex justify-center">
          <InstagramPreview 
            ad={metaAd}
            companyName={companyName}
            onGenerateImage={handleGenerateImage}
          />
        </TabsContent>
      )}
      
      {linkedInAd && isPlatformSelected('linkedin') && (
        <TabsContent value="linkedin" className="flex justify-center">
          <LinkedInAdPreview 
            ad={linkedInAd}
            analysisResult={analysisResult}
          />
        </TabsContent>
      )}
      
      {microsoftAd && isPlatformSelected('microsoft') && (
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
