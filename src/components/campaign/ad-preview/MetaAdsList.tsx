
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Copy, Image, Loader2 } from "lucide-react";

interface MetaAdsListProps {
  metaAds: MetaAd[];
  analysisResult: WebsiteAnalysisResult;
  loadingImageIndex?: number | null;
  onGenerateImage?: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateMetaAd: (index: number, updatedAd: MetaAd) => void;
}

const MetaAdsList: React.FC<MetaAdsListProps> = ({
  metaAds,
  analysisResult,
  loadingImageIndex,
  onGenerateImage,
  onUpdateMetaAd,
}) => {
  const handleCopyText = (ad: MetaAd) => {
    const text = `Headline: ${ad.headline}\n\nPrimary Text: ${ad.primaryText}\n\nDescription: ${ad.description}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {metaAds.map((ad, index) => (
        <Card key={`meta-ad-${index}`} className="overflow-hidden">
          <div className="p-4">
            <h3 className="font-medium text-lg mb-2">{ad.headline}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{ad.primaryText}</p>
            
            {ad.imageUrl ? (
              <div className="rounded-md overflow-hidden mb-3">
                <img 
                  src={ad.imageUrl} 
                  alt={ad.headline} 
                  className="w-full h-auto object-cover" 
                />
              </div>
            ) : (
              <div className="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-md mb-3">
                {loadingImageIndex === index ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Generating image...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Image className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">No image generated</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onUpdateMetaAd(index, { ...ad })}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleCopyText(ad)}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy Text
              </Button>
              
              {!ad.imageUrl && onGenerateImage && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onGenerateImage(ad, index)}
                  disabled={loadingImageIndex === index}
                >
                  {loadingImageIndex === index ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
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
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MetaAdsList;
