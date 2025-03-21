
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BannerFormat, BannerPlatform } from "./SmartBannerBuilder";
import { TextElement, BannerElement } from "@/hooks/smart-banner/useBannerEditor";

interface BannerPreviewProps {
  format: BannerFormat;
  platform: BannerPlatform;
  backgroundImage: string | null;
  textElements: TextElement[];
  bannerElements: BannerElement[];
}

const BannerPreview: React.FC<BannerPreviewProps> = ({
  format,
  platform,
  backgroundImage,
  textElements,
  bannerElements
}) => {
  // Determine dimensions based on format
  const getDimensions = () => {
    switch (format) {
      case "square":
        return {
          width: 1080,
          height: 1080,
          aspectRatio: "aspect-square",
          label: "1080 × 1080"
        };
      case "horizontal":
        return {
          width: platform === "linkedin" ? 1200 : 1080,
          height: platform === "linkedin" ? 627 : 566,
          aspectRatio: platform === "linkedin" ? "aspect-[1200/627]" : "aspect-[1080/566]",
          label: platform === "linkedin" ? "1200 × 627" : "1080 × 566"
        };
      case "story":
        return {
          width: 1080,
          height: 1920,
          aspectRatio: "aspect-[9/16]",
          label: "1080 × 1920"
        };
      default:
        return {
          width: 1080,
          height: 1080,
          aspectRatio: "aspect-square",
          label: "1080 × 1080"
        };
    }
  };

  const { width, height, aspectRatio, label } = getDimensions();

  // Helper function to determine the platform label
  const getPlatformLabel = () => {
    switch (platform) {
      case "instagram":
        return format === "story" ? "Instagram Story" : "Instagram Feed";
      case "linkedin":
        return format === "square" ? "LinkedIn Square" : "LinkedIn Feed";
      case "google":
        return "Google Display";
      default:
        return "Preview";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Live Preview</CardTitle>
          <Badge variant="outline">{getPlatformLabel()}</Badge>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <span>{label}</span>
          <span>•</span>
          <span>{platform}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`relative ${aspectRatio} overflow-hidden rounded-md border bg-gray-50 mb-2`}>
          {backgroundImage ? (
            <img
              src={backgroundImage}
              alt="Banner Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              No background image
            </div>
          )}
          
          {/* Render all banner elements */}
          {bannerElements.map(element => {
            const style = {
              position: 'absolute',
              left: `${element.x}%`,
              top: `${element.y}%`,
              transform: `translate(-50%, -50%) scale(${(element.scale || 100) / 100})`,
              zIndex: element.zIndex || 1,
              color: element.color || 'black',
              fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
              fontWeight: element.fontWeight || 'normal',
              textAlign: element.textAlign || 'center' as const,
              width: element.width || 'auto',
              padding: '0.25rem'
            };
            
            if (element.type === 'text') {
              return (
                <div key={element.id} style={style as React.CSSProperties}>
                  {element.content}
                </div>
              );
            }
            
            // Add support for other element types (logos, shapes, etc.)
            return null;
          })}
        </div>
        
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            This is how your banner will appear on {platform} {format} ads.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BannerPreview;
