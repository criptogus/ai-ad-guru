
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Image } from "lucide-react";
import { PreviewSectionProps } from "./types";

const AdPreviewSection: React.FC<PreviewSectionProps> = ({
  ad,
  companyName,
  isGeneratingImage,
  index,
  loadingImageIndex,
  onGenerateImage,
  onUpdateAd
}) => {
  const isLoading = loadingImageIndex === index || isGeneratingImage;

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-hidden bg-white">
        {/* Instagram Header */}
        <div className="flex items-center p-2 border-b">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
          <div className="ml-2">
            <p className="text-sm font-semibold">{companyName}</p>
            <p className="text-xs text-gray-500">Sponsored</p>
          </div>
        </div>

        {/* Instagram Image */}
        {ad.imageUrl ? (
          <img 
            src={ad.imageUrl} 
            alt="Instagram Ad" 
            className="w-full aspect-square object-cover" 
          />
        ) : (
          <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
            {isLoading ? (
              <div className="text-center">
                <Loader2 className="h-8 w-8 mx-auto animate-spin text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">Generating image...</p>
              </div>
            ) : (
              <div className="text-center">
                <Image className="h-8 w-8 mx-auto text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">No image generated yet</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onGenerateImage} 
                  className="mt-2"
                >
                  Generate Image
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Instagram Caption */}
        <div className="p-3">
          <p className="text-sm font-semibold mb-1">{companyName}</p>
          <p className="text-sm whitespace-pre-line">{ad.primaryText}</p>
          <p className="text-sm text-blue-500 mt-1">{ad.description || "Learn More"}</p>
        </div>
      </div>

      {/* Regenerate Image Button */}
      {ad.imageUrl && !isLoading && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onGenerateImage} 
          className="w-full"
        >
          <Image className="h-4 w-4 mr-2" />
          Regenerate Image
        </Button>
      )}
    </div>
  );
};

export default AdPreviewSection;
