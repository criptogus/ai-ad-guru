
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BannerFormat, BannerPlatform } from "@/components/smart-banner/types";
import { TextElement, BannerElement } from "@/hooks/smart-banner/types";
import ExportPreview from "./ExportPreview";
import SaveToCampaignOption from "./SaveToCampaignOption";
import DownloadOption from "./DownloadOption";

interface ExportOptionsProps {
  format: BannerFormat;
  platform: BannerPlatform;
  backgroundImage: string | null;
  textElements: TextElement[];
  bannerElements: BannerElement[];
  onBack: () => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({
  format,
  platform,
  backgroundImage,
  textElements,
  bannerElements,
  onBack
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Your Banner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ExportPreview 
              backgroundImage={backgroundImage} 
              bannerElements={bannerElements} 
            />
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Export Options</h3>
              <p className="text-sm text-muted-foreground">
                Choose how you want to use your banner
              </p>
              
              <div className="space-y-4">
                <SaveToCampaignOption 
                  backgroundImage={backgroundImage}
                  platform={platform}
                  format={format}
                />
                
                <DownloadOption 
                  backgroundImage={backgroundImage}
                  bannerElements={bannerElements}
                  format={format}
                  platform={platform}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-1">
          <ArrowLeft size={16} /> Back to Editor
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExportOptions;
