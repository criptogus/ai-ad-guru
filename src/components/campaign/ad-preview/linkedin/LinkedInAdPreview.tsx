
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import LinkedInImageDisplay from "./LinkedInImageDisplay";

interface LinkedInAdPreviewProps {
  ad: MetaAd;
  analysisResult: WebsiteAnalysisResult;
  isGeneratingImage?: boolean;
  onGenerateImage?: () => Promise<void>;
  imageFormat?: string;
}

const LinkedInAdPreview: React.FC<LinkedInAdPreviewProps> = ({
  ad,
  analysisResult,
  isGeneratingImage = false,
  onGenerateImage,
  imageFormat = "square"
}) => {
  const companyName = analysisResult?.companyName || "Company Name";
  const callToAction = ad.description || "Learn More";

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm max-w-md mx-auto">
      {/* LinkedIn header */}
      <div className="p-3 border-b flex items-center">
        <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center text-gray-600 font-bold">
          {companyName.charAt(0)}
        </div>
        <div className="ml-2">
          <p className="font-medium text-sm">{companyName}</p>
          <p className="text-xs text-gray-500">Sponsored · LinkedIn</p>
        </div>
      </div>

      {/* Ad image */}
      <LinkedInImageDisplay 
        imageUrl={ad.imageUrl}
        isGeneratingImage={isGeneratingImage}
        onGenerateImage={onGenerateImage}
        imageFormat={imageFormat}
      />

      {/* Ad content */}
      <div className="p-3">
        <h3 className="font-semibold mb-1">{ad.headline || "Ad Headline"}</h3>
        <p className="text-sm text-gray-700 mb-2 line-clamp-3">{ad.primaryText || "Ad primary text goes here"}</p>
        <div className="flex items-center text-blue-600 text-sm">
          <span>{callToAction}</span>
        </div>
      </div>

      {/* LinkedIn engagement */}
      <div className="px-3 py-2 border-t text-xs text-gray-500 flex items-center space-x-4">
        <span>0 reactions</span>
        <span>0 comments</span>
      </div>
    </div>
  );
};

export default LinkedInAdPreview;
