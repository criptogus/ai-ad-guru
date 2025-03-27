
import React, { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, LayoutGrid, Laptop, Smartphone } from "lucide-react";
import LinkedInAdPreview from "./LinkedInAdPreview";

interface LinkedInAdsListProps {
  linkedInAds: MetaAd[];
  analysisResult: WebsiteAnalysisResult;
  loadingImageIndex: number | null;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateAd: (index: number, updatedAd: MetaAd) => void;
}

const LinkedInAdsList: React.FC<LinkedInAdsListProps> = ({
  linkedInAds,
  analysisResult,
  loadingImageIndex,
  onGenerateImage,
  onUpdateAd,
}) => {
  const [viewType, setViewType] = useState<"feed" | "sidebar" | "message">("feed");
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");
  const [imageFormat, setImageFormat] = useState<"landscape" | "square">("landscape");

  const handleGenerateImage = async (index: number): Promise<void> => {
    return onGenerateImage(linkedInAds[index], index);
  };

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <Card className="p-1">
          <CardContent className="p-1">
            <Tabs value={viewType} onValueChange={(v) => setViewType(v as any)} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="feed">
                  <Newspaper className="h-4 w-4 mr-2" />
                  Feed
                </TabsTrigger>
                <TabsTrigger value="sidebar">
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Sidebar
                </TabsTrigger>
                <TabsTrigger value="message">
                  <Newspaper className="h-4 w-4 mr-2" />
                  Message
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Card className="p-1">
            <CardContent className="p-1">
              <Tabs value={deviceView} onValueChange={(v) => setDeviceView(v as any)} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="desktop">
                    <Laptop className="h-4 w-4 mr-2" />
                    Desktop
                  </TabsTrigger>
                  <TabsTrigger value="mobile">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Mobile
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="p-1">
            <CardContent className="p-1">
              <Tabs value={imageFormat} onValueChange={(v) => setImageFormat(v as any)} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="landscape">Landscape</TabsTrigger>
                  <TabsTrigger value="square">Square</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ad List */}
      <div className="space-y-12 py-4">
        {linkedInAds.map((ad, index) => (
          <div key={index} className="flex justify-center mb-6 last:mb-0">
            <LinkedInAdPreview
              ad={ad}
              analysisResult={analysisResult}
              isGeneratingImage={loadingImageIndex === index}
              onGenerateImage={() => handleGenerateImage(index)}
              onUpdateAd={(updatedAd) => onUpdateAd(index, updatedAd)}
              previewType={viewType}
              deviceView={deviceView}
              imageFormat={imageFormat}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkedInAdsList;
