
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image, Loader2, AlertCircle } from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InstagramPreviewProps {
  ad: MetaAd;
  analysisResult: WebsiteAnalysisResult;
  imageKey: number;
  loadingImageIndex: number | null;
  index: number;
  onGenerateImage: () => Promise<void>;
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  ad,
  analysisResult,
  imageKey,
  loadingImageIndex,
  index,
  onGenerateImage
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const isLoading = loadingImageIndex === index;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Image failed to load:", ad.imageUrl);
    setImageError(true);
    e.currentTarget.src = "https://placehold.co/600x600/e0e0e0/818181?text=Image+Not+Available";
  };

  const handleRetryGeneration = async () => {
    setImageError(false);
    await onGenerateImage();
  };

  return (
    <div className="border rounded-lg overflow-hidden mb-4 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white p-3 border-b flex items-center">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
        <div className="ml-2 flex-grow">
          <div className="font-semibold text-sm">{analysisResult.companyName}</div>
          <div className="text-xs text-gray-500">Sponsored</div>
        </div>
        <div className="text-gray-500">•••</div>
      </div>
      
      {/* Image */}
      <div className="bg-gray-100 aspect-square relative">
        {ad.imageUrl && !isLoading && !imageError ? (
          <img 
            key={imageKey}
            src={ad.imageUrl} 
            alt={ad.headline}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-6 w-6 animate-spin mb-2" />
                <span className="text-sm text-gray-500">Generating image...</span>
              </div>
            ) : imageError ? (
              <div className="flex flex-col items-center text-center max-w-[80%]">
                <AlertCircle className="h-10 w-10 text-destructive mb-2" />
                <p className="text-sm font-medium text-destructive mb-1">Image generation failed</p>
                <p className="text-xs text-gray-500 mb-3">There was a problem generating your image.</p>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleRetryGeneration}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <Image size={40} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 text-center mb-2">No image generated yet</p>
                <Button 
                  size="sm" 
                  onClick={onGenerateImage}
                  disabled={loadingImageIndex !== null}
                >
                  Generate Image
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Caption */}
      <div className="bg-white p-3">
        <div className="flex items-center space-x-4 mb-2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 8.7-8.7a.97.97 0 0 1 1.41 0l6.89 6.89" /><path d="M13 13.8 21 21" /><path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
        </div>
        
        <div>
          <span className="font-semibold text-sm">{analysisResult.companyName}</span>
          <span className="text-sm"> {ad.primaryText}</span>
        </div>
        
        <div className="mt-1 text-sm">
          <span className="font-semibold">{ad.headline}</span>
          <span className="text-gray-500"> {ad.description}</span>
        </div>
        
        <div className="mt-2">
          <button className="w-full py-1.5 rounded bg-[#0095f6] text-white font-semibold text-sm">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstagramPreview;
