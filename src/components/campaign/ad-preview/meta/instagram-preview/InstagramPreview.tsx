
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { cn } from "@/lib/utils";
import { HeartIcon, MessageCircle, Share2Icon, Bookmark } from "lucide-react";
import ImageDisplay from "./ImageDisplay";

interface InstagramPreviewProps {
  ad: MetaAd;
  companyName: string;
  index?: number;
  isLoading?: boolean;
  onGenerateImage?: () => Promise<void>;
  format?: "feed" | "story" | "reel";
  className?: string;
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  ad,
  companyName,
  index = 0,
  isLoading = false,
  onGenerateImage,
  format = "feed",
  className
}) => {
  return (
    <div className={cn("bg-white border rounded-lg overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-sm font-medium">
              {companyName.charAt(0)}
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold">{companyName}</div>
            <div className="text-xs text-muted-foreground">Sponsored</div>
          </div>
        </div>
        <button className="text-lg">•••</button>
      </div>

      {/* Image */}
      <div className={cn(
        "relative",
        format === "feed" ? "aspect-square" : "aspect-[9/16]"
      )}>
        <ImageDisplay 
          imageUrl={ad.imageUrl}
          alt={ad.headline || "Instagram ad"}
          isLoading={isLoading}
          onGenerateImage={onGenerateImage}
          imagePrompt={ad.imagePrompt}
          format={format}
        />
      </div>

      {/* Content */}
      <div className="p-3 border-t">
        {/* Action buttons */}
        <div className="flex justify-between mb-2">
          <div className="flex space-x-4">
            <button className="text-foreground hover:text-muted-foreground transition-colors">
              <HeartIcon className="h-6 w-6" />
            </button>
            <button className="text-foreground hover:text-muted-foreground transition-colors">
              <MessageCircle className="h-6 w-6" />
            </button>
            <button className="text-foreground hover:text-muted-foreground transition-colors">
              <Share2Icon className="h-6 w-6" />
            </button>
          </div>
          <button className="text-foreground hover:text-muted-foreground transition-colors">
            <Bookmark className="h-6 w-6" />
          </button>
        </div>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold mr-1">{companyName}</span>
          <span>{ad.primaryText}</span>
        </div>

        {/* CTA Button */}
        {ad.description && (
          <button className="w-full mt-3 bg-blue-500 text-white py-2 px-4 rounded text-sm font-semibold hover:bg-blue-600 transition-colors">
            {ad.description}
          </button>
        )}
      </div>
    </div>
  );
};

export default InstagramPreview;
