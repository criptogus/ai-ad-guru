
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BannerFormat, BannerPlatform } from "./types";

interface BannerSettingsProps {
  selectedFormat: BannerFormat;
  selectedPlatform: BannerPlatform;
  onFormatChange: (format: BannerFormat) => void;
  onPlatformChange: (platform: BannerPlatform) => void;
}

const BannerSettings: React.FC<BannerSettingsProps> = ({
  selectedFormat,
  selectedPlatform,
  onFormatChange,
  onPlatformChange
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Banner Settings</CardTitle>
        <CardDescription>
          Choose the platform and format for your ad banner
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Select Platform</h3>
            <Tabs 
              defaultValue={selectedPlatform} 
              onValueChange={(value) => onPlatformChange(value as BannerPlatform)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="instagram">Instagram</TabsTrigger>
                <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                <TabsTrigger value="google">Google Ads</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div>
            <h3 className="font-medium mb-3">Select Format</h3>
            <Tabs 
              defaultValue={selectedFormat} 
              onValueChange={(value) => onFormatChange(value as BannerFormat)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="square">Square</TabsTrigger>
                <TabsTrigger value="horizontal">Horizontal</TabsTrigger>
                <TabsTrigger value="story">Story/Vertical</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BannerSettings;
