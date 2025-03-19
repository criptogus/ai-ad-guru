
import React from "react";
import LinkedInAdPreview from "@/components/campaign/ad-preview/linkedin/LinkedInAdPreview";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

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
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Ad Preview</h3>
      <div className="border rounded-md p-4 bg-gray-50">
        <LinkedInAdPreview 
          ad={testAd} 
          analysisResult={companyInfo}
          isGeneratingImage={isGenerating}
          onGenerateImage={onGenerateImage}
        />
      </div>
      <div className="text-xs text-muted-foreground">
        <p>This preview shows how your LinkedIn ad might appear. Actual appearance may vary.</p>
        <p className="mt-2">Note: Images generated in test mode don't consume credits and are for preview purposes only.</p>
      </div>
    </div>
  );
};

export default LinkedInPreviewSection;
