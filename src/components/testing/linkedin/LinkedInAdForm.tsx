
import React, { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdContentTab from "./AdContentTab";
import ImageGenerationTab from "./ImageGenerationTab";
import CompanyInfoTab from "./CompanyInfoTab";

interface LinkedInAdFormProps {
  testAd: MetaAd;
  companyInfo: WebsiteAnalysisResult;
  industry: string;
  adTheme: string;
  imageFormat: string;
  isGenerating: boolean;
  onCompanyNameChange: (value: string) => void;
  onAdChange: (field: keyof MetaAd, value: string) => void;
  onIndustryChange: (value: string) => void;
  onAdThemeChange: (value: string) => void;
  onImageFormatChange: (value: string) => void;
  onGenerateImage: () => Promise<void>;
  onReset: () => void;
}

const LinkedInAdForm: React.FC<LinkedInAdFormProps> = ({
  testAd,
  companyInfo,
  industry,
  adTheme,
  imageFormat,
  isGenerating,
  onCompanyNameChange,
  onAdChange,
  onIndustryChange,
  onAdThemeChange,
  onImageFormatChange,
  onGenerateImage,
  onReset
}) => {
  const [activeTab, setActiveTab] = useState<string>("content");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="content">Ad Content</TabsTrigger>
          <TabsTrigger value="image">Image Generation</TabsTrigger>
          <TabsTrigger value="settings">Company Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <AdContentTab testAd={testAd} onAdChange={onAdChange} />
        </TabsContent>
        
        <TabsContent value="image" className="space-y-4">
          <ImageGenerationTab 
            testAd={testAd}
            adTheme={adTheme}
            imageFormat={imageFormat}
            isGenerating={isGenerating}
            onAdChange={onAdChange}
            onAdThemeChange={onAdThemeChange}
            onImageFormatChange={onImageFormatChange}
            onGenerateImage={onGenerateImage}
          />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <CompanyInfoTab 
            companyInfo={companyInfo}
            industry={industry}
            onCompanyNameChange={onCompanyNameChange}
            onIndustryChange={onIndustryChange}
            onReset={onReset}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LinkedInAdForm;
