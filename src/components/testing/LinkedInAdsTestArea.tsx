
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MetaAd } from "@/hooks/adGeneration";
import { useImageGeneration } from "@/hooks/adGeneration/useImageGeneration";
import LinkedInAdForm from "./linkedin/LinkedInAdForm";
import LinkedInPreviewSection from "./linkedin/LinkedInPreviewSection";
import { defaultAd, defaultAnalysisResult } from "./linkedin/defaultData";
import { useAuth } from "@/contexts/AuthContext";
import { useForm, FormProvider } from "react-hook-form";

const LinkedInAdsTestArea: React.FC = () => {
  const [testAd, setTestAd] = useState<MetaAd>(defaultAd);
  const [companyInfo, setCompanyInfo] = useState(defaultAnalysisResult);
  const { generateAdImage, isGenerating, error } = useImageGeneration();
  const { user } = useAuth();
  
  // LinkedIn-specific image generation parameters
  const [industry, setIndustry] = useState("Technology");
  const [adTheme, setAdTheme] = useState("Innovation & Technology");
  const [imageFormat, setImageFormat] = useState("square"); // square (1080x1080) or landscape (1200x627)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Initialize form with explicit default values for all fields
  const methods = useForm({
    defaultValues: {
      ad: testAd,
      companyInfo: companyInfo,
      industry: industry,
      adTheme: adTheme,
      imageFormat: imageFormat,
      testAd: testAd, // Make sure this matches what might be used in components
      companyName: companyInfo.companyName,
      primaryText: testAd.primaryText || "",
      headline: testAd.headline || "",
      description: testAd.description || "",
      imagePrompt: testAd.imagePrompt || ""
    }
  });

  const handleCompanyNameChange = (value: string) => {
    setCompanyInfo({ ...companyInfo, companyName: value });
    // Update the form value
    methods.setValue("companyInfo", { ...companyInfo, companyName: value });
    methods.setValue("companyName", value);
  };

  const handleAdChange = (field: keyof MetaAd, value: string) => {
    if (field === "imagePrompt") {
      // Extract templateId if this is coming from a template
      const templateIdMatch = value.match(/templateId:([a-f0-9-]+)/i);
      if (templateIdMatch && templateIdMatch[1]) {
        setSelectedTemplateId(templateIdMatch[1]);
      } else {
        setSelectedTemplateId(null);
      }
    }
    
    const updatedAd = { ...testAd, [field]: value };
    setTestAd(updatedAd);
    
    // Update form values
    methods.setValue("ad", updatedAd);
    methods.setValue("testAd", updatedAd);
    methods.setValue(field as any, value);
  };

  const handleReset = () => {
    setTestAd(defaultAd);
    setCompanyInfo(defaultAnalysisResult);
    setIndustry("Technology");
    setAdTheme("Innovation & Technology");
    setImageFormat("square");
    setSelectedTemplateId(null);
    
    // Reset form values
    methods.reset({
      ad: defaultAd,
      companyInfo: defaultAnalysisResult,
      industry: "Technology",
      adTheme: "Innovation & Technology",
      imageFormat: "square",
      testAd: defaultAd,
      companyName: defaultAnalysisResult.companyName,
      primaryText: defaultAd.primaryText || "",
      headline: defaultAd.headline || "",
      description: defaultAd.description || "",
      imagePrompt: defaultAd.imagePrompt || ""
    });
    
    toast.info("Test ad reset to default values");
  };

  const handleGenerateImage = async (): Promise<void> => {
    if (!testAd.imagePrompt) {
      toast.error("Please provide an image prompt first");
      return;
    }

    try {
      // Create additional context info for image generation
      const additionalInfo = {
        companyName: companyInfo.companyName,
        brandTone: companyInfo.brandTone,
        targetAudience: companyInfo.targetAudience,
        uniqueSellingPoints: companyInfo.uniqueSellingPoints,
        industry: industry,
        adTheme: adTheme,
        imageFormat: imageFormat,
        platform: "linkedin",
        userId: user?.id,
        templateId: selectedTemplateId
      };

      const imageUrl = await generateAdImage(testAd.imagePrompt, additionalInfo);
      
      if (imageUrl) {
        const updatedAd = { ...testAd, imageUrl };
        setTestAd(updatedAd);
        
        // Update form values
        methods.setValue("ad", updatedAd);
        methods.setValue("testAd", updatedAd);
        
        // Show credit usage toast
        toast.success("LinkedIn ad image generated", {
          description: "5 credits were used for this AI-powered image generation"
        });
      }
    } catch (error) {
      console.error("Error generating LinkedIn ad image:", error);
      toast.error("Failed to generate image", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  };

  return (
    <FormProvider {...methods}>
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
            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
};

export default LinkedInAdsTestArea;
