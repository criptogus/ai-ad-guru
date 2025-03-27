
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Image, RotateCw, Edit } from "lucide-react";
import { PreviewSectionProps } from "./types";
import MetaImagePromptGallery from "../MetaImagePromptGallery";

const AdPreviewSection: React.FC<PreviewSectionProps> = ({
  ad,
  companyName,
  isGeneratingImage,
  index,
  loadingImageIndex,
  onGenerateImage,
  onUpdateAd
}) => {
  const [showPromptGallery, setShowPromptGallery] = useState(false);
  const isLoading = loadingImageIndex === index || isGeneratingImage;

  const handleSelectPrompt = (prompt: string) => {
    if (onUpdateAd) {
      onUpdateAd({
        ...ad,
        imagePrompt: prompt
      });
    }
    setShowPromptGallery(false);
  };

  return (
    <div className="space-y-4">
      {showPromptGallery && (
        <MetaImagePromptGallery 
          initialPrompt={ad.imagePrompt || ""} 
          onSelectPrompt={handleSelectPrompt} 
        />
      )}

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
          <div className="relative group">
            <img 
              src={ad.imageUrl} 
              alt="Instagram Ad" 
              className="w-full aspect-square object-cover" 
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowPromptGallery(true)}
                className="bg-white text-gray-800 hover:bg-gray-100"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Prompt
              </Button>
            </div>
          </div>
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
                <div className="flex flex-col gap-2 mt-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowPromptGallery(true)}
                    className="text-blue-600"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Prompt
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onGenerateImage}
                  >
                    Generate Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instagram Caption */}
        <div className="p-3">
          <p className="text-sm font-semibold mb-1">{companyName}</p>
          <p className="text-sm whitespace-pre-line">{ad.primaryText}</p>
          <p className="text-sm text-blue-500 mt-1">{ad.description || "Learn More"}</p>
          
          {ad.hashtags && ad.hashtags.length > 0 && (
            <p className="text-xs text-blue-600 mt-2">
              {ad.hashtags.map(tag => `#${tag}`).join(' ')}
            </p>
          )}
        </div>
      </div>

      {/* Display the image prompt if available */}
      {ad.imagePrompt && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Image prompt:</span> {ad.imagePrompt}
        </div>
      )}

      {/* Regenerate Image Button */}
      {ad.imageUrl && !isLoading && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onGenerateImage} 
          className="w-full"
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Regenerate Image
        </Button>
      )}
    </div>
  );
};

export default AdPreviewSection;
