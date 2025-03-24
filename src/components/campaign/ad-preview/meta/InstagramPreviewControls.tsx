
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Image, Video, Smartphone, LayoutGrid, MonitorSmartphone } from "lucide-react";

interface InstagramPreviewControlsProps {
  viewType: "feed" | "story" | "reel";
  onViewTypeChange: (type: "feed" | "story" | "reel") => void;
  imageFormat: string;
  onImageFormatChange: (format: string) => void;
  deviceView: "mobile" | "desktop";
  onDeviceViewChange: (view: "mobile" | "desktop") => void;
}

const InstagramPreviewControls: React.FC<InstagramPreviewControlsProps> = ({
  viewType,
  onViewTypeChange,
  imageFormat,
  onImageFormatChange,
  deviceView,
  onDeviceViewChange,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">View Format</label>
          <Tabs
            value={viewType}
            onValueChange={(v) => onViewTypeChange(v as "feed" | "story" | "reel")}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="feed" className="flex items-center gap-1.5">
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Feed</span>
              </TabsTrigger>
              <TabsTrigger value="story" className="flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Story</span>
              </TabsTrigger>
              <TabsTrigger value="reel" className="flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reel</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Image Format</label>
          <Tabs
            value={imageFormat}
            onValueChange={onImageFormatChange}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-2 w-full sm:w-auto">
              <TabsTrigger value="square" className="flex items-center gap-1.5">
                <div className="h-3.5 w-3.5 border border-current"></div>
                <span className="hidden sm:inline">Square</span>
              </TabsTrigger>
              <TabsTrigger value="portrait" className="flex items-center gap-1.5">
                <div className="h-4 w-3 border border-current"></div>
                <span className="hidden sm:inline">Portrait</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Device View</label>
          <Tabs
            value={deviceView}
            onValueChange={(v) => onDeviceViewChange(v as "mobile" | "desktop")}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-2 w-full sm:w-auto">
              <TabsTrigger value="mobile" className="flex items-center gap-1.5">
                <Smartphone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </TabsTrigger>
              <TabsTrigger value="desktop" className="flex items-center gap-1.5">
                <MonitorSmartphone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default InstagramPreviewControls;
