
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MetaAd } from "@/hooks/adGeneration";
import { Button } from "@/components/ui/button";
import { Newspaper, Smartphone, Video } from "lucide-react";
import InstagramPreview from "./instagram-preview/InstagramPreview";

interface InstagramAdsPreviewProps {
  ads: MetaAd[];
  companyName: string;
  loadingImageIndex: number | null;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateAd: (index: number, updatedAd: MetaAd) => void;
}

const InstagramAdsPreview: React.FC<InstagramAdsPreviewProps> = ({
  ads,
  companyName,
  loadingImageIndex,
  onGenerateImage,
  onUpdateAd,
}) => {
  const [viewMode, setViewMode] = useState<"feed" | "story" | "reel">("feed");

  const handleGenerateImage = async (index: number): Promise<void> => {
    if (onGenerateImage) {
      return onGenerateImage(ads[index], index);
    }
    return Promise.resolve();
  };

  const handleUpdateAd = (index: number, updatedAd: MetaAd) => {
    if (onUpdateAd) {
      onUpdateAd(index, updatedAd);
    }
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        {/* Format Toggle Bar */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Button
              variant={viewMode === "feed" ? "default" : "ghost"}
              size="sm"
              className={`h-10 rounded-md px-4 ${
                viewMode === "feed" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setViewMode("feed")}
            >
              <Newspaper className="h-4 w-4 mr-2" />
              Feed
            </Button>
            <Button
              variant={viewMode === "story" ? "default" : "ghost"}
              size="sm"
              className={`h-10 rounded-md px-4 ${
                viewMode === "story" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setViewMode("story")}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Story
            </Button>
            <Button
              variant={viewMode === "reel" ? "default" : "ghost"}
              size="sm"
              className={`h-10 rounded-md px-4 ${
                viewMode === "reel" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setViewMode("reel")}
            >
              <Video className="h-4 w-4 mr-2" />
              Reel
            </Button>
          </div>
        </div>

        {/* Mobile-style Preview Column with improved spacing */}
        <div className="max-w-[430px] mx-auto space-y-12 overflow-y-auto max-h-[75vh] pb-16 px-3">
          {ads.map((ad, index) => (
            <div 
              key={index} 
              className="transition-all duration-200 ease-in-out animate-fade-in"
            >
              <InstagramPreview
                ad={ad}
                companyName={companyName}
                index={index}
                loadingImageIndex={loadingImageIndex}
                onGenerateImage={() => handleGenerateImage(index)}
                onUpdateAd={(updatedAd) => handleUpdateAd(index, updatedAd)}
                viewMode={viewMode}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
