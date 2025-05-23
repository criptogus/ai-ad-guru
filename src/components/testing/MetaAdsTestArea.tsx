import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useWebsiteAnalysis, { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { useConnectionTest } from "@/hooks/adConnections/useConnectionTest";
import { MetaAd } from "@/hooks/adGeneration";
import { useImageGeneration } from "@/hooks/adGeneration/useImageGeneration";
import NewMetaAdForm from "./meta/NewMetaAdForm";
import { useAuth } from "@/contexts/AuthContext";

const defaultMetaAd: MetaAd = {
  headline: "Discover Our New Product",
  primaryText: "Transform your daily routine with our innovative solution. Designed for maximum efficiency and built to last.",
  description: "Shop Now",
  imagePrompt: "A professional lifestyle product image with clean background and modern aesthetic",
};

const MetaAdsTestArea: React.FC = () => {
  const [testAds, setTestAds] = useState<MetaAd[]>([]);
  const [testAd, setTestAd] = useState<MetaAd>(defaultMetaAd);
  const { generateAdImage, isGenerating, error } = useImageGeneration();
  const { user } = useAuth();
  
  const [companyInfo, setCompanyInfo] = useState<WebsiteAnalysisResult>({
    companyName: "Sample Company",
    companyDescription: "A leading provider of technology solutions",
    businessDescription: "A leading provider of technology solutions",
    brandTone: "Professional & Modern",
    targetAudience: "Business professionals, 30-45 years old",
    uniqueSellingPoints: ["Quality", "Innovation", "Reliability"],
    keywords: ["efficiency", "professional", "innovation", "time-saving", "productivity", "modern solution"],
    callToAction: ["Contact us today", "Learn more"],
    websiteUrl: "https://example.com"
  });
  
  const [industry, setIndustry] = useState("Technology");
  const [adTheme, setAdTheme] = useState("Innovation & Technology");
  const [imageFormat, setImageFormat] = useState<"square" | "portrait" | "landscape">("square");

  const handleCompanyNameChange = (value: string) => {
    setCompanyInfo({ ...companyInfo, companyName: value });
  };

  const handleAdChange = (field: keyof MetaAd, value: string) => {
    setTestAd({ ...testAd, [field]: value });
  };

  const handleImageFormatChange = (value: string) => {
    if (value === "square" || value === "portrait" || value === "landscape") {
      setImageFormat(value);
    } else {
      console.error("Invalid image format:", value);
    }
  };

  const handleReset = () => {
    setTestAd(defaultMetaAd);
    setCompanyInfo({
      companyName: "Sample Company",
      companyDescription: "A leading provider of technology solutions",
      businessDescription: "A leading provider of technology solutions",
      brandTone: "Professional & Modern",
      targetAudience: "Business professionals, 30-45 years old",
      uniqueSellingPoints: ["Quality", "Innovation", "Reliability"],
      keywords: ["efficiency", "professional", "innovation", "time-saving", "productivity", "modern solution"],
      callToAction: ["Contact us today", "Learn more"],
      websiteUrl: "https://example.com"
    });
    toast.info("Test ad reset to default values");
  };

  const handleGenerateImage = async (): Promise<void> => {
    if (!testAd.imagePrompt) {
      toast.error("Please provide an image prompt first");
      return;
    }

    try {
      const additionalInfo = {
        companyName: companyInfo.companyName,
        brandTone: companyInfo.brandTone,
        targetAudience: companyInfo.targetAudience,
        uniqueSellingPoints: companyInfo.uniqueSellingPoints,
        industry: industry,
        adTheme: adTheme,
        imageFormat: imageFormat,
        platform: "instagram",
        userId: user?.id
      };

      const imageUrl = await generateAdImage(testAd.imagePrompt, additionalInfo);
      
      if (imageUrl) {
        setTestAd(prev => ({ ...prev, imageUrl }));
        
        toast.success("Instagram ad image generated", {
          description: "5 credits were used for this AI-powered image generation"
        });
      }
    } catch (error) {
      console.error("Error generating Instagram ad image:", error);
      toast.error("Failed to generate image", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  };
  
  const handleAddTestAd = () => {
    if (!testAd.imageUrl) {
      toast.error("Please generate an image first");
      return;
    }
    
    setTestAds(prev => [...prev, { ...testAd }]);
    
    setTestAd({
      headline: "",
      primaryText: "",
      description: "",
      imagePrompt: "",
      imageUrl: undefined
    });
    
    toast.success("Test ad added to the list");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Meta/Instagram Ads Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <NewMetaAdForm
              testAd={testAd}
              companyInfo={companyInfo}
              industry={industry}
              adTheme={adTheme}
              imageFormat={imageFormat}
              isGenerating={isGenerating}
              onCompanyNameChange={handleCompanyNameChange}
              onAdChange={handleAdChange}
              onIndustryChange={setIndustry}
              onAdThemeChange={setAdTheme}
              onImageFormatChange={handleImageFormatChange}
              onGenerateImage={handleGenerateImage}
              onReset={handleReset}
            />
            
            <div className="space-y-4">
              <div className="border rounded-md overflow-hidden">
                {testAd.imageUrl ? (
                  <img src={testAd.imageUrl} alt="Generated Ad" className="w-full h-auto" />
                ) : (
                  <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-500">
                    No Image Generated
                  </div>
                )}
              </div>
              
              <Button onClick={handleGenerateImage} disabled={isGenerating || !testAd.imagePrompt}>
                {isGenerating ? "Generating..." : "Generate Image"}
              </Button>
            </div>
          </div>
          
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </CardContent>
      </Card>

      {testAds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Ads List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testAds.map((ad, index) => (
                <div key={index} className="border rounded-md p-4">
                  <h4 className="text-sm font-semibold mb-2">{ad.headline}</h4>
                  <p className="text-xs text-gray-500">{ad.primaryText}</p>
                  {ad.imageUrl && (
                    <img src={ad.imageUrl} alt={`Ad ${index + 1}`} className="w-full h-auto mt-2" />
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={handleAddTestAd} className="mt-4">
              Add Ad to List
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MetaAdsTestArea;
