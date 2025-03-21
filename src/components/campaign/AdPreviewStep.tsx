
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import GoogleAdsTab from "./ad-preview/GoogleAdsTab";
import MetaAdsTab from "./ad-preview/MetaAdsTab";
import LinkedInAdsTab from "./ad-preview/LinkedInAdsTab";
import MicrosoftAdsTab from "./ad-preview/MicrosoftAdsTab";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Laptop, Smartphone, SplitSquareHorizontal, SplitSquareVertical, Monitor } from "lucide-react";

interface AdPreviewStepProps {
  analysisResult: WebsiteAnalysisResult;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  microsoftAds: any[];
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateGoogleAds: () => Promise<void>;
  onGenerateMetaAds: () => Promise<void>;
  onGenerateMicrosoftAds: () => Promise<void>;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateGoogleAd: (index: number, updatedAd: GoogleAd) => void;
  onUpdateMetaAd: (index: number, updatedAd: MetaAd) => void;
  onUpdateMicrosoftAd: (index: number, updatedAd: any) => void;
  onNext: () => void;
  onBack: () => void;
}

type PreviewLayout = "split-horizontal" | "split-vertical" | "preview-only" | "edit-only";
type DevicePreview = "desktop" | "mobile" | "tablet";
type AdFormat = "square" | "vertical" | "horizontal" | "story" | "feed" | "search";

const AdPreviewStep: React.FC<AdPreviewStepProps> = ({
  analysisResult,
  googleAds,
  metaAds,
  microsoftAds,
  isGenerating,
  loadingImageIndex,
  onGenerateGoogleAds,
  onGenerateMetaAds,
  onGenerateMicrosoftAds,
  onGenerateImage,
  onUpdateGoogleAd,
  onUpdateMetaAd,
  onUpdateMicrosoftAd,
  onNext,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<string>("google");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [previewLayout, setPreviewLayout] = useState<PreviewLayout>("split-horizontal");
  const [devicePreview, setDevicePreview] = useState<DevicePreview>("desktop");
  const [adFormat, setAdFormat] = useState<AdFormat>("search");

  useEffect(() => {
    // Load campaign data from localStorage to get selected platforms
    const storedCampaign = localStorage.getItem('campaignData');
    if (storedCampaign) {
      try {
        const campaignData = JSON.parse(storedCampaign);
        if (campaignData.platforms && campaignData.platforms.length > 0) {
          setSelectedPlatforms(campaignData.platforms);
          // Set active tab to the first selected platform
          setActiveTab(campaignData.platforms[0]);
          
          // Set default format based on platform
          if (campaignData.platforms[0] === 'google') {
            setAdFormat('search');
          } else if (campaignData.platforms[0] === 'meta') {
            setAdFormat('feed');
          } else if (campaignData.platforms[0] === 'linkedin') {
            setAdFormat('square');
          }
        } else {
          // Default to 'google' if no platforms are selected
          setSelectedPlatforms(['google']);
          setAdFormat('search');
        }
      } catch (error) {
        console.error('Error parsing campaign data from localStorage:', error);
        setSelectedPlatforms(['google']);
        setAdFormat('search');
      }
    } else {
      // Default to 'google' if no campaign data exists
      setSelectedPlatforms(['google']);
      setAdFormat('search');
    }
  }, []);

  // Change ad format based on active tab
  useEffect(() => {
    if (activeTab === 'google') {
      setAdFormat('search');
    } else if (activeTab === 'meta') {
      setAdFormat('feed');
    } else if (activeTab === 'linkedin') {
      setAdFormat('square');
    }
  }, [activeTab]);

  // Only show tabs for selected platforms
  const renderTabs = () => {
    if (selectedPlatforms.length === 0) {
      return (
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="google">Google Ads</TabsTrigger>
        </TabsList>
      );
    }

    return (
      <TabsList className={`grid w-full grid-cols-${Math.min(selectedPlatforms.length, 4)}`}>
        {selectedPlatforms.includes('google') && (
          <TabsTrigger value="google">Google Ads</TabsTrigger>
        )}
        {selectedPlatforms.includes('meta') && (
          <TabsTrigger value="meta">Instagram (Meta)</TabsTrigger>
        )}
        {selectedPlatforms.includes('linkedin') && (
          <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
        )}
        {selectedPlatforms.includes('microsoft') && (
          <TabsTrigger value="microsoft">Microsoft Ads</TabsTrigger>
        )}
      </TabsList>
    );
  };

  // Adapter function to convert single ad update to array update for GoogleAdsTab
  const handleUpdateGoogleAds = (updatedAds: GoogleAd[]) => {
    // In this case, we're receiving the whole updated array from GoogleAdsTab
    updatedAds.forEach((ad, index) => {
      if (index < googleAds.length) {
        onUpdateGoogleAd(index, ad);
      }
    });
  };

  // Get available formats for the current platform
  const getAvailableFormats = () => {
    switch (activeTab) {
      case 'google':
        return [
          { value: 'search', label: 'Search Ad' },
          { value: 'display', label: 'Display Ad' },
        ];
      case 'meta':
        return [
          { value: 'feed', label: 'Feed Post' },
          { value: 'story', label: 'Story' },
          { value: 'square', label: 'Square (1:1)' },
          { value: 'vertical', label: 'Vertical (4:5)' },
        ];
      case 'linkedin':
        return [
          { value: 'square', label: 'Single Image' },
          { value: 'horizontal', label: 'Document Ad' },
        ];
      case 'microsoft':
        return [
          { value: 'search', label: 'Search Ad' },
          { value: 'display', label: 'Display Ad' },
        ];
      default:
        return [
          { value: 'search', label: 'Search Ad' },
        ];
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Preview & Customization</CardTitle>
        <CardDescription>
          Generate and customize your ad creatives for each platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant={previewLayout === "split-horizontal" ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setPreviewLayout("split-horizontal")}
              title="Split view (horizontal)"
            >
              <SplitSquareHorizontal className="h-4 w-4" />
            </Button>
            <Button 
              variant={previewLayout === "split-vertical" ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setPreviewLayout("split-vertical")}
              title="Split view (vertical)"
            >
              <SplitSquareVertical className="h-4 w-4" />
            </Button>
            <Button 
              variant={previewLayout === "preview-only" ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setPreviewLayout("preview-only")}
              title="Preview only"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button 
              variant={previewLayout === "edit-only" ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setPreviewLayout("edit-only")}
              title="Edit only"
            >
              <div className="w-4 h-4 flex items-center justify-center font-bold">{"{}"}</div>
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant={devicePreview === "desktop" ? "secondary" : "outline"} 
                size="sm"
                onClick={() => setDevicePreview("desktop")}
              >
                <Laptop className="h-4 w-4" />
              </Button>
              <Button 
                variant={devicePreview === "mobile" ? "secondary" : "outline"} 
                size="sm"
                onClick={() => setDevicePreview("mobile")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">Format:</span>
              <Select value={adFormat} onValueChange={(value) => setAdFormat(value as AdFormat)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableFormats().map(format => (
                    <SelectItem key={format.value} value={format.value}>{format.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          {renderTabs()}

          <TabsContent value="google" className="space-y-4">
            <div className={`
              ${previewLayout === "split-horizontal" ? "grid grid-cols-2 gap-6" : ""}
              ${previewLayout === "split-vertical" ? "grid grid-rows-2 gap-6" : ""}
              ${previewLayout === "preview-only" ? "grid grid-cols-1" : ""}
              ${previewLayout === "edit-only" ? "grid grid-cols-1" : ""}
            `}>
              <GoogleAdsTab
                googleAds={googleAds}
                isGenerating={isGenerating}
                onGenerateAds={onGenerateGoogleAds}
                onUpdateGoogleAd={handleUpdateGoogleAds}
                analysisResult={analysisResult}
                previewLayout={previewLayout}
                devicePreview={devicePreview}
                adFormat={adFormat}
              />
            </div>
          </TabsContent>

          <TabsContent value="meta" className="space-y-4">
            <div className={`
              ${previewLayout === "split-horizontal" ? "grid grid-cols-2 gap-6" : ""}
              ${previewLayout === "split-vertical" ? "grid grid-rows-2 gap-6" : ""}
              ${previewLayout === "preview-only" ? "grid grid-cols-1" : ""}
              ${previewLayout === "edit-only" ? "grid grid-cols-1" : ""}
            `}>
              <MetaAdsTab
                metaAds={metaAds}
                isGenerating={isGenerating}
                loadingImageIndex={loadingImageIndex}
                onGenerateMetaAds={onGenerateMetaAds}
                onGenerateImage={onGenerateImage}
                onUpdateAd={(index, updatedAd) => onUpdateMetaAd(index, updatedAd)}
                analysisResult={analysisResult}
                previewLayout={previewLayout}
                devicePreview={devicePreview}
                adFormat={adFormat}
              />
            </div>
          </TabsContent>

          <TabsContent value="linkedin" className="space-y-4">
            <div className={`
              ${previewLayout === "split-horizontal" ? "grid grid-cols-2 gap-6" : ""}
              ${previewLayout === "split-vertical" ? "grid grid-rows-2 gap-6" : ""}
              ${previewLayout === "preview-only" ? "grid grid-cols-1" : ""}
              ${previewLayout === "edit-only" ? "grid grid-cols-1" : ""}
            `}>
              <LinkedInAdsTab
                linkedInAds={metaAds}
                isGenerating={isGenerating}
                loadingImageIndex={loadingImageIndex}
                onGenerateLinkedInAds={onGenerateMetaAds}
                onGenerateImage={onGenerateImage}
                onUpdateAd={(index, updatedAd) => onUpdateMetaAd(index, updatedAd)}
                analysisResult={analysisResult}
                previewLayout={previewLayout}
                devicePreview={devicePreview}
                adFormat={adFormat}
              />
            </div>
          </TabsContent>

          <TabsContent value="microsoft" className="space-y-4">
            <div className={`
              ${previewLayout === "split-horizontal" ? "grid grid-cols-2 gap-6" : ""}
              ${previewLayout === "split-vertical" ? "grid grid-rows-2 gap-6" : ""}
              ${previewLayout === "preview-only" ? "grid grid-cols-1" : ""}
              ${previewLayout === "edit-only" ? "grid grid-cols-1" : ""}
            `}>
              <MicrosoftAdsTab
                microsoftAds={microsoftAds}
                isGenerating={isGenerating}
                onGenerateMicrosoftAds={onGenerateMicrosoftAds}
                onUpdateAd={(index, updatedAd) => onUpdateMicrosoftAd(index, updatedAd)}
                analysisResult={analysisResult}
                previewLayout={previewLayout}
                devicePreview={devicePreview}
                adFormat={adFormat}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdPreviewStep;
