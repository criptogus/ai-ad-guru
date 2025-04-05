import React from "react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { cn } from "@/lib/utils";
import ImageDisplay from "./ImageDisplay";
import ContentSection from "./ContentSection";
import FooterSection from "./FooterSection";

interface InstagramPreviewProps {
  ad: MetaAd;
  companyName: string;
  isGeneratingImage?: boolean;
  loadingImageIndex?: number | null;
  index?: number;
  onGenerateImage?: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  ad,
  companyName,
  isGeneratingImage = false,
  loadingImageIndex = null,
  index = 0,
  onGenerateImage,
  onUpdateAd
}) => {
  return (
    <div className="w-full rounded-md border bg-white dark:bg-gray-800 dark:border-gray-700 overflow-hidden shadow-sm">
      {/* Header Section */}
      <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-300 mr-2">
            {/* Placeholder for profile image */}
          </div>
          <div className="font-semibold">{companyName}</div>
        </div>
        <div>...</div>
      </div>

      {/* Image Section */}
      <div className="aspect-w-1 aspect-h-1">
        <ImageDisplay
          imageUrl={ad.imageUrl || ""}
          alt={ad.headline}
          onGenerateImage={onGenerateImage}
          isLoading={isGeneratingImage && loadingImageIndex === index}
          imagePrompt={ad.imagePrompt}
        />
      </div>

      {/* Content Section */}
      <ContentSection ad={ad} companyName={companyName} />

      {/* Footer Section */}
      <FooterSection ad={ad} companyName={companyName} />
    </div>
  );
};

export default InstagramPreview;
