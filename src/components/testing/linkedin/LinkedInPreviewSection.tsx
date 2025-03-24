
import React, { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import LinkedInAdPreview from "@/components/campaign/ad-preview/linkedin/LinkedInAdPreview";
import LinkedInPreviewControls from "@/components/campaign/ad-preview/linkedin/LinkedInPreviewControls";

interface LinkedInPreviewSectionProps {
  testAd: MetaAd;
  companyInfo: WebsiteAnalysisResult;
  isGenerating: boolean;
  onGenerateImage: () => Promise<void>;
}

const LinkedInPreviewSection: React.FC<LinkedInPreviewSectionProps> = ({
  testAd,
  companyInfo,
  isGenerating,
  onGenerateImage
}) => {
  const [previewType, setPreviewType] = useState<"feed" | "sidebar" | "message">("feed");
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");
  const [imageFormat, setImageFormat] = useState<string>("landscape");

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">LinkedIn Ad Preview</h3>
      
      <LinkedInPreviewControls 
        previewType={previewType}
        deviceView={deviceView}
        imageFormat={imageFormat}
        onPreviewTypeChange={setPreviewType}
        onDeviceViewChange={setDeviceView}
        onImageFormatChange={setImageFormat}
      />
      
      <div className="bg-gray-50 p-4 rounded-md">
        <LinkedInAdPreview 
          ad={testAd}
          analysisResult={companyInfo}
          isGeneratingImage={isGenerating}
          onGenerateImage={onGenerateImage}
          imageFormat={imageFormat}
          previewType={previewType}
          deviceView={deviceView}
        />
      </div>
      
      <div className="text-xs text-muted-foreground">
        <p>This preview shows how your LinkedIn ad might appear. Actual appearance may vary.</p>
      </div>
    </div>
  );
};

export default LinkedInPreviewSection;
