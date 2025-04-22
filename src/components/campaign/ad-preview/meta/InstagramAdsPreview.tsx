import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MetaAd } from "@/hooks/adGeneration";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2, Newspaper, Smartphone, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import InstagramPreview from "./instagram-preview/InstagramPreview";

interface InstagramAdsPreviewProps {
  ads: MetaAd[];
  companyName: string;
  isLoading?: boolean;
  loadingImageIndex: number | null;
  onGenerateAds?: () => Promise<void>;
  onGenerateImage?: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateAd?: (index: number, updatedAd: MetaAd) => void;
}

const InstagramAdsPreview: React.FC<InstagramAdsPreviewProps> = ({
  ads,
  companyName,
  isLoading = false,
  loadingImageIndex,
  onGenerateAds,
  onGenerateImage,
  onUpdateAd,
}) => {
  const [viewMode, setViewMode] = useState<"feed" | "story" | "reel">("feed");

  const handleGenerateImage = async (ad: MetaAd, index: number): Promise<void> => {
    if (onGenerateImage) {
      await onGenerateImage(ad, index);
    }
  };

  return (
    <Card className="border shadow-sm dark:bg-gray-900">
      <CardContent className="p-6">
        {/* Format Toggle Bar */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-3 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Button
              variant={viewMode === "feed" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-10 rounded-md px-4",
                viewMode === "feed" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setViewMode("feed")}
            >
              <Newspaper className="h-4 w-4 mr-2" />
              Feed
            </Button>
            <Button
              variant={viewMode === "story" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-10 rounded-md px-4",
                viewMode === "story" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setViewMode("story")}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Story
            </Button>
            <Button
              variant={viewMode === "reel" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-10 rounded-md px-4",
                viewMode === "reel" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setViewMode("reel")}
            >
              <Video className="h-4 w-4 mr-2" />
              Reel
            </Button>
          </div>
        </div>

        {/* Mobile-style Preview Column with improved spacing */}
        <div className="max-w-[450px] mx-auto space-y-12 overflow-y-auto max-h-[75vh] pb-16 px-6">
          {ads.map((ad, index) => (
            <div 
              key={index} 
              className="transition-all duration-200 ease-in-out animate-fade-in group"
            >
              <InstagramPreview
                ad={ad}
                companyName={companyName}
                index={index}
                loadingImageIndex={loadingImageIndex}
                onGenerateImage={() => handleGenerateImage(ad, index)}
                onUpdateAd={(updatedAd) => onUpdateAd && onUpdateAd(index, updatedAd)}
                viewMode={viewMode}
                isLoading={loadingImageIndex === index}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InstagramAdsPreview;
