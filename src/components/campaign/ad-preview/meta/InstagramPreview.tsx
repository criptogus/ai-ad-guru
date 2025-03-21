
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { Button } from "@/components/ui/button";
import { Loader2, ImagePlus } from "lucide-react";

interface InstagramPreviewProps {
  ad: MetaAd;
  companyName: string;
  loadingImageIndex?: number | null;
  index?: number;
  onGenerateImage?: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  ad,
  companyName,
  loadingImageIndex,
  index,
  onGenerateImage,
  onUpdateAd,
}) => {
  const isLoading = loadingImageIndex === index;
  const hasGenerateAction = !!onGenerateImage;
  const hasImageUrl = !!ad.imageUrl;

  const handleGenerateImage = async () => {
    if (onGenerateImage) {
      await onGenerateImage();
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm max-w-[360px]">
      {/* Instagram header */}
      <div className="flex items-center p-2 border-b">
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
          {companyName.substring(0, 1).toUpperCase()}
        </div>
        <div className="ml-2 flex-1">
          <div className="text-sm font-semibold">{companyName}</div>
          <div className="text-xs text-gray-500">Sponsored</div>
        </div>
        <div className="text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </div>
      </div>

      {/* Ad image */}
      <div className="aspect-square relative">
        {hasImageUrl ? (
          <img
            src={ad.imageUrl}
            alt={ad.headline}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-4">
            {hasGenerateAction ? (
              <>
                {isLoading ? (
                  <div className="text-center">
                    <Loader2 className="h-10 w-10 text-gray-400 animate-spin mx-auto mb-3" />
                    <span className="text-sm text-gray-500">
                      Generating image...
                    </span>
                  </div>
                ) : (
                  <Button
                    onClick={handleGenerateImage}
                    variant="outline"
                    className="flex flex-col h-auto py-3 gap-2"
                  >
                    <ImagePlus className="h-8 w-8 text-gray-400" />
                    <span>Generate Image</span>
                  </Button>
                )}
              </>
            ) : (
              <div className="text-center">
                <ImagePlus className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <span className="text-sm text-gray-500">Image placeholder</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ad content */}
      <div className="p-3 space-y-2">
        <div className="text-sm">
          <span className="font-semibold">{companyName}</span> {ad.primaryText}
        </div>

        <div className="text-sm font-medium text-blue-700">{ad.headline}</div>

        <div className="text-xs text-gray-500">{ad.description}</div>
      </div>

      {/* Instagram engagement bar */}
      <div className="border-t px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7.1 7 7-7" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-700"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    </div>
  );
};

export default InstagramPreview;
