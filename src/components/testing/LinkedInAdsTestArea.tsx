
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MetaAd } from "@/hooks/useAdGeneration";
import { useImageGeneration } from "@/hooks/adGeneration/useImageGeneration";
import LinkedInAdForm from "./linkedin/LinkedInAdForm";
import LinkedInPreviewSection from "./linkedin/LinkedInPreviewSection";
import { defaultAd, defaultAnalysisResult } from "./linkedin/defaultData";

const LinkedInAdsTestArea: React.FC = () => {
  const [testAd, setTestAd] = useState<MetaAd>(defaultAd);
  const [companyInfo, setCompanyInfo] = useState(defaultAnalysisResult);
  const { generateAdImage, isGenerating, lastError } = useImageGeneration();
  
  // LinkedIn-specific image generation parameters
  const [industry, setIndustry] = useState("Technology");
  const [adTheme, setAdTheme] = useState("Innovation & Technology");
  const [imageFormat, setImageFormat] = useState("square"); // square (1080x1080) or landscape (1200x627)

  const handleCompanyNameChange = (value: string) => {
    setCompanyInfo({ ...companyInfo, companyName: value });
  };

  const handleAdChange = (field: keyof MetaAd, value: string) => {
    setTestAd({ ...testAd, [field]: value });
  };

  const handleReset = () => {
    setTestAd(defaultAd);
    setCompanyInfo(defaultAnalysisResult);
    setIndustry("Technology");
    setAdTheme("Innovation & Technology");
    setImageFormat("square");
    toast.info("Test ad reset to default values");
  };

  const handleGenerateImage = async (): Promise<void> => {
    if (!testAd.imagePrompt) {
      toast.error("Please provide an image prompt first");
      return;
    }

    toast.info("Generating LinkedIn ad image...", {
      description: "This might take a few moments. No credits will be consumed in test mode.",
      duration: 3000,
    });

    try {
      // Enhanced LinkedIn-specific prompt with B2B focus
      const enhancedPrompt = `
${testAd.imagePrompt}

This should be a high-quality, professional LinkedIn ad image optimized for B2B marketing with these specifications:
- Industry: ${industry}
- Ad Theme: ${adTheme}
- Target Audience: ${companyInfo.targetAudience}
- Setting: Modern corporate environment, professional context
- Visual Style: Clean, well-lit, crisp, with a focus on credibility and professionalism
- Mood: Trustworthy, authoritative, success-driven
- Brand Elements: Subtle professional color palette
      `.trim();

      // Pass additional context from companyInfo to enhance image generation
      const additionalInfo = {
        companyName: companyInfo.companyName,
        brandTone: companyInfo.brandTone,
        targetAudience: companyInfo.targetAudience,
        uniqueSellingPoints: companyInfo.uniqueSellingPoints,
        industry: industry,
        adTheme: adTheme,
        imageFormat: imageFormat, // square or landscape format for LinkedIn
        platform: "linkedin" // Specify platform for image generation
      };

      const imageUrl = await generateAdImage(enhancedPrompt, additionalInfo);
      
      if (imageUrl) {
        setTestAd(prev => ({ ...prev, imageUrl, imagePrompt: enhancedPrompt }));
        toast.success("LinkedIn ad image generated successfully");
      }
    } catch (error) {
      console.error("Error generating LinkedIn ad image:", error);
      toast.error("Failed to generate image", {
        description: error instanceof Error ? error.message : "Please try again later",
        duration: 5000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>LinkedIn Ads Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <LinkedInAdForm
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
              onImageFormatChange={setImageFormat}
              onGenerateImage={handleGenerateImage}
              onReset={handleReset}
            />

            <LinkedInPreviewSection
              testAd={testAd}
              companyInfo={companyInfo}
              isGenerating={isGenerating}
              onGenerateImage={handleGenerateImage}
            />
          </div>
          {lastError && (
            <p className="text-sm text-red-500 mt-2">{lastError}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedInAdsTestArea;
