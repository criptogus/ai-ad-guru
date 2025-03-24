
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import LinkedInImageDisplay from "@/components/campaign/ad-preview/linkedin/LinkedInImageDisplay";

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
      <h3 className="text-sm font-medium">LinkedIn Ad Preview</h3>
      
      <div className="border rounded-md overflow-hidden bg-white">
        {/* LinkedIn header */}
        <div className="p-3 border-b flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            {companyInfo.companyName.charAt(0)}
          </div>
          <div className="ml-2">
            <div className="font-medium text-sm">{companyInfo.companyName}</div>
            <div className="text-xs text-gray-500">Sponsored • LinkedIn Ad</div>
          </div>
        </div>
        
        {/* Ad body */}
        <div className="p-3">
          <p className="text-sm mb-3">{testAd.primaryText}</p>
          
          {/* Image area - now using the LinkedInImageDisplay component */}
          <div className="aspect-video mb-3">
            <LinkedInImageDisplay
              imageUrl={testAd.imageUrl}
              isGeneratingImage={isGenerating}
              onGenerateImage={onGenerateImage}
              imageFormat="landscape"
            />
          </div>
          
          {/* Headline and CTA */}
          <div className="border rounded-md overflow-hidden">
            <div className="p-3">
              <h3 className="font-medium">{testAd.headline}</h3>
              <p className="text-sm text-gray-500 truncate">{companyInfo.websiteUrl}</p>
            </div>
            <div className="bg-blue-700 text-white p-2 text-center text-sm font-medium">
              {testAd.description}
            </div>
          </div>
        </div>
        
        {/* LinkedIn footer */}
        <div className="border-t p-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">Like</div>
            <div className="text-sm text-gray-500">Comment</div>
            <div className="text-sm text-gray-500">Share</div>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        <p>This preview shows how your LinkedIn ad might appear. Actual appearance may vary.</p>
      </div>
    </div>
  );
};

export default LinkedInPreviewSection;
