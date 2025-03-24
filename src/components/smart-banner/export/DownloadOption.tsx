
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BannerFormat, BannerPlatform } from "@/components/smart-banner/types";
import { BannerElement } from "@/hooks/smart-banner/types";

interface DownloadOptionProps {
  backgroundImage: string | null;
  bannerElements: BannerElement[];
  format: BannerFormat;
  platform: BannerPlatform;
}

const DownloadOption: React.FC<DownloadOptionProps> = ({
  backgroundImage,
  bannerElements,
  format,
  platform
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    if (!backgroundImage) return;
    
    setIsExporting(true);
    try {
      const canvas = document.createElement("canvas");
      
      let width, height;
      if (format === "square") {
        width = 1080;
        height = 1080;
      } else if (format === "horizontal") {
        width = platform === "linkedin" ? 1200 : 1080;
        height = platform === "linkedin" ? 627 : 566;
      } else if (format === "story") {
        width = 1080;
        height = 1920;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        toast.error("Could not create canvas context");
        return;
      }
      
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = backgroundImage;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      ctx.drawImage(img, 0, 0, width, height);
      
      const sortedElements = [...bannerElements].sort((a, b) => 
        (a.zIndex || 0) - (b.zIndex || 0)
      );
      
      for (const element of sortedElements) {
        if (element.type === 'text') {
          ctx.save();
          ctx.fillStyle = element.color || 'black';
          ctx.font = `${element.fontWeight || 'normal'} ${element.fontSize || 16}px Arial`;
          ctx.textAlign = element.textAlign as CanvasTextAlign || 'center';
          
          const x = width * (element.x / 100);
          const y = height * (element.y / 100);
          
          ctx.fillText(element.content, x, y);
          ctx.restore();
        }
      }
      
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      
      if (!blob) {
        toast.error("Failed to generate image");
        return;
      }
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `banner-${platform}-${format}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Banner downloaded successfully");
    } catch (error) {
      console.error("Error downloading banner:", error);
      toast.error("Failed to download banner");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="border rounded-md p-4 hover:bg-gray-50 transition cursor-pointer">
      <div className="flex items-start gap-3">
        <Download className="h-10 w-10 p-2 rounded-md bg-primary/10 text-primary" />
        <div>
          <h4 className="text-sm font-medium">Download as PNG</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Download your banner for use anywhere
          </p>
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DownloadOption;
