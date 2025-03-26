
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MetaAd } from "@/hooks/adGeneration";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";
import ImageContent from "./instagram-preview/ImageContent";
import HeaderContent from "./instagram-preview/HeaderContent";
import TextContent from "./instagram-preview/TextContent";
import ActionBar from "./instagram-preview/ActionBar";

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
  onUpdateAd
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [activeFormat, setActiveFormat] = useState<"feed" | "story" | "reel">(
    ad.format as "feed" | "story" | "reel" || "feed"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoading = typeof loadingImageIndex === 'number' && typeof index === 'number' && loadingImageIndex === index;

  useEffect(() => {
    // Ensure the format selector stays in sync with the ad's format
    if (ad.format && (ad.format === "feed" || ad.format === "story" || ad.format === "reel")) {
      setActiveFormat(ad.format);
    }
  }, [ad.format]);

  const handleGenerateImage = async () => {
    if (onGenerateImage) {
      await onGenerateImage();
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Image upload logic would go here
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Fake upload process for demo purposes
      setTimeout(() => {
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleFormatChange = (format: "feed" | "story" | "reel") => {
    setActiveFormat(format);
    
    if (onUpdateAd && format !== ad.format) {
      onUpdateAd({
        ...ad,
        format
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Instagram Preview</h3>
          
          <Tabs 
            value={activeFormat} 
            onValueChange={(v) => handleFormatChange(v as "feed" | "story" | "reel")}
            className="w-auto"
          >
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="feed" className="text-xs px-2">Feed</TabsTrigger>
              <TabsTrigger value="story" className="text-xs px-2">Story</TabsTrigger>
              <TabsTrigger value="reel" className="text-xs px-2">Reel</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="bg-white border rounded-md overflow-hidden max-w-[350px] mx-auto">
          <div className="flex flex-col">
            <HeaderContent companyName={companyName} />
            
            <Tabs value={activeFormat} className="w-full">
              <TabsContent value="feed" className="m-0">
                <ImageContent 
                  ad={ad}
                  imageKey={index}
                  isLoading={isLoading}
                  isUploading={isUploading}
                  onGenerateImage={handleGenerateImage}
                  triggerFileUpload={handleFileUpload}
                  format="feed"
                />
              </TabsContent>
              
              <TabsContent value="story" className="m-0">
                <ImageContent 
                  ad={ad}
                  imageKey={index}
                  isLoading={isLoading}
                  isUploading={isUploading}
                  onGenerateImage={handleGenerateImage}
                  triggerFileUpload={handleFileUpload}
                  format="story"
                />
              </TabsContent>
              
              <TabsContent value="reel" className="m-0">
                <ImageContent 
                  ad={ad}
                  imageKey={index}
                  isLoading={isLoading}
                  isUploading={isUploading}
                  onGenerateImage={handleGenerateImage}
                  triggerFileUpload={handleFileUpload}
                  format="reel"
                />
              </TabsContent>
            </Tabs>
            
            {activeFormat === "feed" && (
              <>
                <TextContent ad={ad} />
                <ActionBar />
              </>
            )}
          </div>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileSelected}
        />
        
        {!ad.imageUrl && !isLoading && !isUploading && onGenerateImage && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleGenerateImage}
            >
              Generate Image
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleFileUpload}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InstagramPreview;
