
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BannerFormat, BannerPlatform } from "./SmartBannerBuilder";
import { TextElement, BannerElement } from "@/hooks/smart-banner/useBannerEditor";
import { Download, Share2, Save, ArrowLeft, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getCreditCosts, consumeCredits } from "@/services";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const creditCosts = getCreditCosts();

  const handleDownload = async () => {
    if (!backgroundImage) return;
    
    setIsExporting(true);
    try {
      // Create a temporary canvas to render the banner
      const canvas = document.createElement("canvas");
      
      // Set dimensions based on format
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
      
      // Load background image
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = backgroundImage;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      // Draw background image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Sort elements by z-index
      const sortedElements = [...bannerElements].sort((a, b) => 
        (a.zIndex || 0) - (b.zIndex || 0)
      );
      
      // Draw elements
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
        // Add support for other element types
      }
      
      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      
      if (!blob) {
        toast.error("Failed to generate image");
        return;
      }
      
      // Create a download link
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

  const handleSaveToCampaign = async () => {
    if (!user || !backgroundImage) return;
    
    setIsSaving(true);
    try {
      // Consume credits for banner creation
      const creditSuccess = await consumeCredits(
        user.id,
        creditCosts.smartBanner,
        'smart_banner_creation',
        `Smart Banner - ${platform} ${format}`
      );
      
      if (!creditSuccess) {
        toast.error("Insufficient credits", {
          description: "You don't have enough credits to save this banner"
        });
        return;
      }
      
      // Mock saving banner to campaign
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Show success message
      toast.success("Banner saved to campaign", {
        description: "Your banner has been added to your campaign assets"
      });
      
      // Navigate to campaigns page
      setTimeout(() => {
        navigate("/campaigns");
      }, 1500);
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Failed to save banner");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Your Banner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div className="aspect-video relative overflow-hidden rounded-md bg-gray-100">
                {backgroundImage && (
                  <img
                    src={backgroundImage}
                    alt="Banner Preview"
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Preview of elements */}
                {bannerElements.map(element => {
                  if (element.type === 'text') {
                    return (
                      <div 
                        key={element.id}
                        style={{
                          position: 'absolute',
                          left: `${element.x}%`,
                          top: `${element.y}%`,
                          transform: `translate(-50%, -50%)`,
                          color: element.color || 'black',
                          fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
                          fontWeight: element.fontWeight || 'normal'
                        }}
                      >
                        {element.content}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Export Options</h3>
              <p className="text-sm text-muted-foreground">
                Choose how you want to use your banner
              </p>
              
              <div className="space-y-4">
                <div className="border rounded-md p-4 hover:bg-gray-50 transition cursor-pointer">
                  <div className="flex items-start gap-3">
                    <Save className="h-10 w-10 p-2 rounded-md bg-primary/10 text-primary" />
                    <div>
                      <h4 className="text-sm font-medium">Save to Current Campaign</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Add this banner to your current campaign
                      </p>
                      <Button
                        onClick={handleSaveToCampaign}
                        disabled={isSaving}
                        className="w-full"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save to Campaign ({creditCosts.smartBanner} credits)
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
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
