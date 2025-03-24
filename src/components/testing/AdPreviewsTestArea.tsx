
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GoogleAdsTestArea } from "./GoogleAdsTestArea";
import { MetaAdsTestArea } from "./MetaAdsTestArea";
import { MicrosoftAdsTestArea } from "./MicrosoftAdsTestArea";
import { LinkedInAdsTestArea } from "./LinkedInAdsTestArea";
import { toast } from "sonner";

// Mock data for website analysis
const mockAnalysisResult = {
  companyName: "Zero Digital Agency",
  businessDescription: "Zero Digital Agency is a full-service digital marketing firm specializing in AI-powered ad campaign optimization and creation. We help businesses of all sizes maximize their online presence through data-driven strategies and creative automation.",
  targetAudience: "Marketing directors and business owners (35-55) seeking to improve digital marketing ROI and efficiency through AI-powered solutions.",
  brandTone: "Professional, innovative, and results-oriented with a focus on cutting-edge technology and measurable outcomes.",
  websiteUrl: "https://zerodigital.agency",
  keywords: [
    "AI marketing agency",
    "automated ad campaigns",
    "digital marketing AI",
    "marketing automation",
    "AI-powered advertising"
  ],
  callToAction: [
    "Schedule a free consultation",
    "Get your AI marketing audit",
    "Try our platform free for 14 days"
  ],
  uniqueSellingPoints: [
    "Proprietary AI that improves ad performance by an average of 47%",
    "Full campaign creation and optimization in under 10 minutes",
    "Transparent pricing with performance guarantees",
    "Seamless integration with major ad platforms"
  ]
};

const AdPreviewsTestArea: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [platform, setPlatform] = useState<string>("google");
  
  const handleGenerateImage = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate image generation with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Image generated successfully!");
    } catch (error) {
      toast.error("Failed to generate image");
      console.error("Image generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <Card className="mb-6 card-hover">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl flex items-center justify-between">
            <span>Ad Preview Testing Area</span>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google Ads</SelectItem>
                <SelectItem value="meta">Instagram (Meta)</SelectItem>
                <SelectItem value="microsoft">Microsoft Ads</SelectItem>
                <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {platform === "google" && (
            <GoogleAdsTestArea 
              companyName={mockAnalysisResult.companyName} 
              domain="zerodigital.agency"
            />
          )}
          {platform === "meta" && (
            <MetaAdsTestArea 
              companyName={mockAnalysisResult.companyName}
              isGenerating={isGenerating}
              onGenerateImage={handleGenerateImage}
            />
          )}
          {platform === "microsoft" && (
            <MicrosoftAdsTestArea 
              companyInfo={mockAnalysisResult}
            />
          )}
          {platform === "linkedin" && (
            <LinkedInAdsTestArea 
              companyInfo={mockAnalysisResult}
              isGenerating={isGenerating}
              onGenerateImage={handleGenerateImage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdPreviewsTestArea;
