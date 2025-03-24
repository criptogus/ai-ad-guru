
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { Toggle } from "@/components/ui/toggle";
import { Monitor, Smartphone, Image, LayoutGrid } from "lucide-react";
import GoogleAdPreview from "@/components/campaign/ad-preview/google/GoogleAdPreview";
import InstagramPreview from "@/components/campaign/ad-preview/meta/InstagramPreview";
import LinkedInAdPreview from "@/components/campaign/ad-preview/linkedin/LinkedInAdPreview";
import LinkedInPreviewControls from "@/components/campaign/ad-preview/linkedin/LinkedInPreviewControls";
import MicrosoftAdPreview from "@/components/campaign/ad-preview/microsoft/MicrosoftAdPreview";

const AdPreviewsTestArea: React.FC = () => {
  const [activeTab, setActiveTab] = useState("google");
  const { toast } = useToast();
  
  // Google preview states
  const [googleViewMode, setGoogleViewMode] = useState<"desktop" | "mobile">("desktop");
  const [googleShowEditControls, setGoogleShowEditControls] = useState(false);
  
  // Instagram preview states
  const [instaViewType, setInstaViewType] = useState<"feed" | "story" | "reel">("feed");
  
  // LinkedIn preview states
  const [linkedInPreviewType, setLinkedInPreviewType] = useState<"feed" | "sidebar" | "message">("feed");
  const [linkedInDeviceView, setLinkedInDeviceView] = useState<"desktop" | "mobile">("desktop");
  const [linkedInImageFormat, setLinkedInImageFormat] = useState("landscape");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    toast({
      title: `Switched to ${value} ad previews`,
      description: "Test different ad layouts and formats.",
      duration: 2000,
    });
  };

  // Sample ad data for testing
  const sampleGoogleAd: GoogleAd = {
    headlines: [
      "Transform Your Ad Strategy",
      "AI-Powered Marketing Solutions",
      "Boost ROI by 35%"
    ],
    descriptions: [
      "Create, optimize & manage ads with our AI-driven platform. Save time & money while increasing conversion rates.",
      "Automatic optimization ensures your budget is spent on the best performing ads. Try it free today!"
    ],
    siteLinks: ["Features", "Pricing", "Templates", "Case Studies"]
  };

  const sampleMetaAd: MetaAd = {
    headline: "Transform Your Digital Marketing",
    primaryText: "Harness the power of AI to create stunning ad campaigns across multiple platforms. Our tool analyzes performance in real-time and optimizes for maximum ROI. #digitalmarketing #aimarketing",
    description: "Try our AI-powered platform today and see the difference.",
    imageUrl: "https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    callToAction: "Start Free Trial",
    hashtags: ["digitalmarketing", "aimarketing", "adtech"]
  };

  const sampleWebsiteAnalysis = {
    companyName: "AI Ad Manager",
    businessDescription: "An AI-powered platform for creating and optimizing digital ad campaigns",
    targetAudience: "Digital marketers and business owners",
    brandTone: "Professional, innovative, helpful",
    websiteUrl: "https://aiadmanager.com",
    keywords: ["ai marketing", "ad optimization", "digital ads"],
    callToAction: "Start optimizing your ads today",
    uniqueSellingPoints: ["AI-powered optimization", "Multi-platform support", "Real-time analytics"]
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ad Previews Testing Area</CardTitle>
          <CardDescription>
            Test and visualize how your ads will appear on different platforms and devices
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="google">Google Ads</TabsTrigger>
              <TabsTrigger value="meta">Instagram Ads</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
              <TabsTrigger value="microsoft">Microsoft Ads</TabsTrigger>
            </TabsList>
            
            <TabsContent value="google" className="space-y-4">
              <div className="flex flex-wrap gap-2 justify-end">
                <Toggle
                  pressed={googleViewMode === "desktop"}
                  onPressedChange={() => setGoogleViewMode("desktop")}
                  aria-label="Desktop view"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Desktop
                </Toggle>
                <Toggle
                  pressed={googleViewMode === "mobile"}
                  onPressedChange={() => setGoogleViewMode("mobile")}
                  aria-label="Mobile view"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile
                </Toggle>
                <Toggle
                  pressed={googleShowEditControls}
                  onPressedChange={setGoogleShowEditControls}
                  aria-label="Show edit controls"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Show metrics
                </Toggle>
              </div>
              
              <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                <GoogleAdPreview 
                  ad={sampleGoogleAd} 
                  domain="aiadmanager.com" 
                  viewMode={googleViewMode}
                  showEditControls={googleShowEditControls}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="meta" className="space-y-4">
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant={instaViewType === "feed" ? "default" : "outline"}
                  onClick={() => setInstaViewType("feed")}
                >
                  Feed
                </Button>
                <Button
                  size="sm"
                  variant={instaViewType === "story" ? "default" : "outline"}
                  onClick={() => setInstaViewType("story")}
                >
                  Story
                </Button>
                <Button
                  size="sm"
                  variant={instaViewType === "reel" ? "default" : "outline"}
                  onClick={() => setInstaViewType("reel")}
                >
                  Reel
                </Button>
              </div>
              
              <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                <InstagramPreview 
                  ad={sampleMetaAd} 
                  companyName="AI Ad Manager"
                  viewType={instaViewType}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="linkedin" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <LinkedInPreviewControls 
                    previewType={linkedInPreviewType}
                    deviceView={linkedInDeviceView}
                    imageFormat={linkedInImageFormat}
                    onPreviewTypeChange={setLinkedInPreviewType}
                    onDeviceViewChange={setLinkedInDeviceView}
                    onImageFormatChange={setLinkedInImageFormat}
                  />
                </div>
                
                <div className="md:col-span-2 flex justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                  <LinkedInAdPreview 
                    ad={sampleMetaAd}
                    analysisResult={sampleWebsiteAnalysis}
                    previewType={linkedInPreviewType}
                    deviceView={linkedInDeviceView}
                    imageFormat={linkedInImageFormat}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="microsoft" className="space-y-4">
              <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                <MicrosoftAdPreview 
                  ad={sampleGoogleAd} 
                  domain="aiadmanager.com" 
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdPreviewsTestArea;
