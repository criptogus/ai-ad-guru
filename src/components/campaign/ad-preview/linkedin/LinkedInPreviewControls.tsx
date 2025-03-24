
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Monitor, Smartphone, InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <div className="flex flex-col space-y-3 mb-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-sm font-medium">Preview Settings</h3>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={deviceView === "desktop" ? "default" : "outline"} 
            size="sm"
            onClick={() => onDeviceViewChange("desktop")}
            className="h-8 px-2"
          >
            <Monitor className="h-4 w-4 mr-1" />
            <span className="text-xs">Desktop</span>
          </Button>
          <Button 
            variant={deviceView === "mobile" ? "default" : "outline"} 
            size="sm"
            onClick={() => onDeviceViewChange("mobile")}
            className="h-8 px-2"
          >
            <Smartphone className="h-4 w-4 mr-1" />
            <span className="text-xs">Mobile</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 flex items-center">
            Ad Format
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-3 w-3 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    LinkedIn ads appear in different formats across the platform
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Tabs value={previewType} onValueChange={(v) => onPreviewTypeChange(v as any)} className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-8">
              <TabsTrigger value="feed" className="text-xs py-0">Feed</TabsTrigger>
              <TabsTrigger value="sidebar" className="text-xs py-0">Sidebar</TabsTrigger>
              <TabsTrigger value="message" className="text-xs py-0">InMail</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Image Format</label>
          <Select 
            value={imageFormat} 
            onValueChange={onImageFormatChange}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="landscape">Landscape (1200x627)</SelectItem>
              <SelectItem value="square">Square (1080x1080)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default LinkedInPreviewControls;
