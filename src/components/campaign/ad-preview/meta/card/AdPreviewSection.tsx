import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Image, RotateCw, Edit, Eye } from "lucide-react";
import { PreviewSectionProps } from "./types";
import MetaImagePromptGallery from "../MetaImagePromptGallery";
import { InstagramPreview } from "@/components/campaign/ad-preview/meta/instagram-preview";
import { ScrollArea } from "@/components/ui/scroll-area";

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
          isLoading={isLoading}
          onGenerateImage={onGenerateImage}
          onUpdateAd={onUpdateAd}
          viewMode={currentViewMode}
        />
      </div>

      {/* Display the image prompt if available */}
      {ad.imagePrompt && (
        <MetaImagePromptGallery 
          ad={ad}
          loading={isLoading}
          onGenerateImage={onGenerateImage}
        />
      )}

      {/* Image Template Gallery Section - Horizontal */}
      <div className="mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowPromptGallery(!showPromptGallery)} 
          className="w-full mb-2"
        >
          <Image className="h-4 w-4 mr-2" />
          {showPromptGallery ? "Hide Image Templates" : "Show Image Templates"}
        </Button>
        
        {showPromptGallery && (
          <div className="border rounded-md p-3 bg-muted/10">
            <h4 className="text-sm font-medium mb-2">Select an Image Template</h4>
            <ScrollArea className="h-28 pb-2">
              <div className="flex gap-2 overflow-x-auto pb-2">
                <MetaImagePromptGallery 
                  initialPrompt={ad.imagePrompt || ""} 
                  onSelectPrompt={handleSelectPrompt}
                  displayMode="horizontal" 
                />
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Regenerate Image Button */}
      <div className="flex gap-2">
        {ad.imageUrl && !isLoading && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onGenerateImage} 
            className="w-full"
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Regenerar Imagem
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdPreviewSection;
