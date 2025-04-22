
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import ImageContent from "./ImageContent";

interface InstagramPreviewProps {
  ad: MetaAd;
  companyName: string;
  index?: number;
  loadingImageIndex?: number | null;
  onGenerateImage?: () => void;
  onUpdateAd?: (updatedAd: MetaAd) => void;
  viewMode?: "feed" | "story" | "reel";
  isLoading?: boolean;
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  ad,
  companyName,
  index = 0,
  loadingImageIndex = null,
  onGenerateImage = () => {},
  onUpdateAd,
  viewMode = "feed",
  isLoading = false,
}) => {
  // Determine loading state from both direct isLoading prop and loadingImageIndex
  const isImageLoading = isLoading || loadingImageIndex === index;

  // Define the correct format based on viewMode
  const getFormat = () => {
    if (viewMode === "story" || viewMode === "reel") {
      return viewMode;
    }
    return "feed";
  };

  return (
    <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-md overflow-hidden max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center px-3 py-2 border-b dark:border-gray-800">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
          {companyName.charAt(0).toUpperCase()}
        </div>
        <div className="ml-2 text-sm font-medium">{companyName}</div>
      </div>

      {/* Image */}
      <ImageContent
        ad={ad}
        imageKey={index}
        isLoading={isImageLoading}
        isUploading={false}
        format={getFormat() as "feed" | "story" | "reel"}
        onGenerateImage={onGenerateImage}
      />

      {/* Caption area */}
      <div className="p-3">
        <div className="flex items-start space-x-1">
          <span className="font-medium text-sm">{companyName}</span>
          <span className="text-sm whitespace-pre-wrap break-words">
            {ad.primaryText || ad.description || "Your compelling ad copy goes here."}
          </span>
        </div>

        {/* Action button area */}
        {!isImageLoading && !ad.imageUrl && onGenerateImage && (
          <div className="mt-3">
            <Button
              size="sm"
              className="w-full"
              onClick={onGenerateImage}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstagramPreview;
