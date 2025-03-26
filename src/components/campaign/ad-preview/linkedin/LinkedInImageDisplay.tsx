
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import LinkedInImagePlaceholder from "./LinkedInImagePlaceholder";

interface LinkedInImageDisplayProps {
  ad: MetaAd;
  isGeneratingImage?: boolean;
  onGenerateImage?: () => Promise<void>;
  format?: string;
}

const LinkedInImageDisplay: React.FC<LinkedInImageDisplayProps> = ({
  ad,
  isGeneratingImage = false,
  onGenerateImage,
  format = "landscape"
}) => {
  // Determine aspect ratio based on format
  const getAspectRatioClass = () => {
    switch (format) {
      case "square":
        return "aspect-square";
      case "vertical":
        return "aspect-[4/5]";
      case "landscape":
      default:
        return "aspect-[1.91/1]"; // LinkedIn's recommended 1.91:1
    }
  };

  return (
    <div className={`w-full ${getAspectRatioClass()} relative overflow-hidden bg-gray-100 dark:bg-gray-800`}>
      {ad.imageUrl ? (
        <img
          src={ad.imageUrl}
          alt={ad.headline || "LinkedIn Ad"}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error("LinkedIn image load error");
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <LinkedInImagePlaceholder
          isLoading={isGeneratingImage}
          onGenerate={onGenerateImage}
          format={format}
        />
      )}
    </div>
  );
};

export default LinkedInImageDisplay;
