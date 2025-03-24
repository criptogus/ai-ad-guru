
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, LayoutGrid, LayoutList, MessageSquare } from "lucide-react";

interface LinkedInPreviewControlsProps {
  previewType: "feed" | "sidebar" | "message";
  deviceView: "desktop" | "mobile";
  imageFormat: string;
  onPreviewTypeChange: (value: "feed" | "sidebar" | "message") => void;
  onDeviceViewChange: (value: "desktop" | "mobile") => void;
  onImageFormatChange: (value: string) => void;
}

const LinkedInPreviewControls: React.FC<LinkedInPreviewControlsProps> = ({
  previewType,
  deviceView,
  imageFormat,
  onPreviewTypeChange,
  onDeviceViewChange,
  onImageFormatChange
}) => {
  return (
    <div className="space-y-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-md border">
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Preview Type</div>
        <ToggleGroup type="single" value={previewType} onValueChange={(v) => v && onPreviewTypeChange(v as any)}>
          <ToggleGroupItem value="feed" aria-label="Feed" title="LinkedIn Feed" className="flex-1">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Feed
          </ToggleGroupItem>
          <ToggleGroupItem value="sidebar" aria-label="Sidebar" title="LinkedIn Sidebar" className="flex-1">
            <LayoutList className="h-4 w-4 mr-2" />
            Sidebar
          </ToggleGroupItem>
          <ToggleGroupItem value="message" aria-label="Message" title="LinkedIn Message" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Device View</div>
        <ToggleGroup type="single" value={deviceView} onValueChange={(v) => v && onDeviceViewChange(v as any)}>
          <ToggleGroupItem value="desktop" aria-label="Desktop" title="Desktop view" className="flex-1">
            <Monitor className="h-4 w-4 mr-2" />
            Desktop
          </ToggleGroupItem>
          <ToggleGroupItem value="mobile" aria-label="Mobile" title="Mobile view" className="flex-1">
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Image Format</div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={imageFormat === "landscape" ? "default" : "outline"}
            className="flex-1 text-xs"
            onClick={() => onImageFormatChange("landscape")}
          >
            Landscape (1200×627)
          </Button>
          <Button 
            size="sm" 
            variant={imageFormat === "square" ? "default" : "outline"}
            className="flex-1 text-xs"
            onClick={() => onImageFormatChange("square")}
          >
            Square (1080×1080)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LinkedInPreviewControls;
