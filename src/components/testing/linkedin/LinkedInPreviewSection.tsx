
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MetaAd } from "@/hooks/adGeneration";
import LinkedInAdPreview from "@/components/campaign/ad-preview/linkedin/LinkedInAdPreview";

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
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">LinkedIn Ad Preview</h3>
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <LinkedInAdPreview 
            ad={testAd}
            analysisResult={companyInfo} 
            isGeneratingImage={isGenerating}
            onGenerateImage={onGenerateImage}
            previewType="feed"
          />
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>This is how your ad will appear in the LinkedIn feed. Images will be cropped to fit in the actual LinkedIn ads platform.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedInPreviewSection;
