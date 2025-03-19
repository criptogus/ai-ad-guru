
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, RefreshCw } from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface LinkedInAdPreviewProps {
  ad: MetaAd;
  analysisResult: WebsiteAnalysisResult;
  isGeneratingImage?: boolean;
  onGenerateImage?: () => void;
}

const LinkedInAdPreview: React.FC<LinkedInAdPreviewProps> = ({
  ad,
  analysisResult,
  isGeneratingImage = false,
  onGenerateImage
}) => {
  // Extract company name from analysis result
  const companyName = analysisResult?.companyName || "Company Name";
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-500 mb-2">LinkedIn Ad Preview</h3>
      
      <Card className="border overflow-hidden">
        {/* LinkedIn header */}
        <div className="bg-white border-b p-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
              {companyName.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-sm">{companyName}</div>
              <div className="text-xs text-gray-500">Sponsored • LinkedIn</div>
            </div>
          </div>
        </div>
        
        {/* Ad content */}
        <div className="p-3">
          <div className="text-sm mb-2">
            {ad.primaryText}
          </div>
          
          {/* Image area */}
          <div className="aspect-video bg-gray-100 rounded relative flex items-center justify-center my-2">
            {ad.imageUrl ? (
              <img 
                src={ad.imageUrl} 
                alt="LinkedIn ad" 
                className="w-full h-full object-cover rounded" 
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Image className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">No image generated</span>
                
                {!isGeneratingImage && onGenerateImage && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={onGenerateImage}
                    disabled={isGeneratingImage}
                  >
                    {isGeneratingImage ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Image className="h-4 w-4 mr-1" />
                        Generate Image
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {/* Headline */}
          <div className="font-medium text-base mt-3">{ad.headline}</div>
          
          {/* Description */}
          <div className="text-sm text-gray-700 mt-1">{ad.description}</div>
        </div>
        
        {/* CTA button */}
        <div className="p-3 pt-0">
          <Button 
            variant="outline" 
            className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
          >
            Learn More
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LinkedInAdPreview;
