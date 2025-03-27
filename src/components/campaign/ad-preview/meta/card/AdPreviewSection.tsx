
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Image, RotateCw, Edit, Eye } from "lucide-react";
import { PreviewSectionProps } from "./types";
import MetaImagePromptGallery from "../MetaImagePromptGallery";
import { InstagramPreview } from "@/components/campaign/ad-preview/meta";

const AdPreviewSection: React.FC<PreviewSectionProps> = ({
  ad,
  companyName,
  isGeneratingImage,
  index,
  loadingImageIndex,
  onGenerateImage,
  onUpdateAd,
  viewMode = "feed"
}) => {
  const [showPromptGallery, setShowPromptGallery] = useState(false);
  const [currentViewMode, setCurrentViewMode] = useState<"feed" | "story" | "reel">(viewMode);
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

      {/* View Mode Selector */}
      <div className="flex justify-end mb-2">
        <div className="flex rounded-md overflow-hidden border">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`py-1 h-8 rounded-none ${currentViewMode === 'feed' ? 'bg-muted' : ''}`}
            onClick={() => setCurrentViewMode('feed')}
          >
            <Eye className="h-3 w-3 mr-1" />
            Feed
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`py-1 h-8 rounded-none ${currentViewMode === 'story' ? 'bg-muted' : ''}`}
            onClick={() => setCurrentViewMode('story')}
          >
            <Eye className="h-3 w-3 mr-1" />
            Story
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`py-1 h-8 rounded-none ${currentViewMode === 'reel' ? 'bg-muted' : ''}`}
            onClick={() => setCurrentViewMode('reel')}
          >
            <Eye className="h-3 w-3 mr-1" />
            Reel
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <InstagramPreview
          ad={ad}
          companyName={companyName}
          index={index}
          loadingImageIndex={loadingImageIndex}
          onGenerateImage={onGenerateImage}
          onUpdateAd={onUpdateAd}
        />
      </div>

      {/* Display the image prompt if available */}
      {ad.imagePrompt && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Image prompt:</span> {ad.imagePrompt}
        </div>
      )}

      {/* Regenerate Image Button */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowPromptGallery(true)} 
          className="w-full"
        >
          <Image className="h-4 w-4 mr-2" />
          Image Templates
        </Button>
        
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
    </div>
  );
};

export default AdPreviewSection;
