
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MetaAd } from "@/hooks/useAdGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import LinkedInAdPreview from "@/components/campaign/ad-preview/linkedin/LinkedInAdPreview";
import { useImageGeneration } from "@/hooks/adGeneration/useImageGeneration";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const defaultAnalysisResult: WebsiteAnalysisResult = {
  companyName: "Your Business",
  businessDescription: "A professional company offering innovative solutions",
  websiteUrl: "https://yourbusiness.com",
  brandTone: "Professional",
  targetAudience: "Business professionals and decision makers",
  uniqueSellingPoints: ["Professional services", "Innovative solutions", "Expert team"],
  callToAction: ["Learn More"],
  keywords: ["business", "professional", "solutions"]
};

// LinkedIn-specific business themes
const businessThemes = [
  "Innovation & Technology",
  "Leadership & Management",
  "Digital Transformation",
  "Professional Services",
  "Business Growth",
  "Data Analytics",
  "Enterprise Solutions",
  "B2B Marketing",
  "Talent Acquisition",
  "Corporate Training"
];

// LinkedIn-specific industries
const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Manufacturing",
  "Professional Services",
  "Marketing & Advertising",
  "Education",
  "Real Estate",
  "Telecommunications",
  "SaaS"
];

const LinkedInAdsTestArea: React.FC = () => {
  const [testAd, setTestAd] = useState<MetaAd>({
    headline: "Transform Your Business with Our Solutions",
    primaryText: "Looking to optimize your business processes and increase productivity? Our proven solutions have helped hundreds of companies achieve their goals and grow their business.",
    description: "Schedule a demo today and see how we can help your team succeed.",
    imagePrompt: "A professional team working together in a modern office environment",
    imageUrl: ""
  });
  
  const [companyInfo, setCompanyInfo] = useState<WebsiteAnalysisResult>(defaultAnalysisResult);
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
    setTestAd({
      headline: "Transform Your Business with Our Solutions",
      primaryText: "Looking to optimize your business processes and increase productivity? Our proven solutions have helped hundreds of companies achieve their goals and grow their business.",
      description: "Schedule a demo today and see how we can help your team succeed.",
      imagePrompt: "A professional team working together in a modern office environment",
      imageUrl: ""
    });
    setCompanyInfo(defaultAnalysisResult);
    setIndustry("Technology");
    setAdTheme("Innovation & Technology");
    setImageFormat("square");
    toast.info("Test ad reset to default values");
  };

  const handleGenerateImage = async () => {
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
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName" 
                  value={companyInfo.companyName} 
                  onChange={(e) => handleCompanyNameChange(e.target.value)}
                  placeholder="Your Business"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={industry}
                    onValueChange={setIndustry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="adTheme">Ad Theme</Label>
                  <Select
                    value={adTheme}
                    onValueChange={setAdTheme}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessThemes.map((theme) => (
                        <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="imageFormat">Image Format</Label>
                <Select
                  value={imageFormat}
                  onValueChange={setImageFormat}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Image Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square (1080×1080) - Best for Mobile</SelectItem>
                    <SelectItem value="landscape">Landscape (1200×627) - Standard</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground mt-1">
                  Square format tends to perform better on mobile devices
                </div>
              </div>

              <div>
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={testAd.headline}
                  onChange={(e) => handleAdChange('headline', e.target.value)}
                  maxLength={150}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {testAd.headline.length}/150 characters
                </div>
              </div>

              <div>
                <Label htmlFor="primaryText">Primary Text</Label>
                <Textarea
                  id="primaryText"
                  value={testAd.primaryText}
                  onChange={(e) => handleAdChange('primaryText', e.target.value)}
                  maxLength={600}
                  rows={4}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {testAd.primaryText.length}/600 characters
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={testAd.description}
                  onChange={(e) => handleAdChange('description', e.target.value)}
                  maxLength={600}
                  rows={2}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {testAd.description.length}/600 characters
                </div>
              </div>

              <div>
                <Label htmlFor="imagePrompt">Image Prompt</Label>
                <Textarea
                  id="imagePrompt"
                  value={testAd.imagePrompt}
                  onChange={(e) => handleAdChange('imagePrompt', e.target.value)}
                  placeholder="Describe the professional LinkedIn image you want to generate..."
                  rows={3}
                />
                <div className="flex justify-between mt-2">
                  <Button 
                    onClick={handleGenerateImage} 
                    disabled={isGenerating || !testAd.imagePrompt}
                    variant="default"
                  >
                    {isGenerating ? "Generating..." : "Generate LinkedIn Image"}
                  </Button>
                  <Button onClick={handleReset} variant="outline">Reset to Default</Button>
                </div>
                {lastError && (
                  <p className="text-sm text-red-500 mt-2">{lastError}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Ad Preview</h3>
              <div className="border rounded-md p-4 bg-gray-50">
                <LinkedInAdPreview 
                  ad={testAd} 
                  analysisResult={companyInfo}
                  isGeneratingImage={isGenerating}
                  onGenerateImage={handleGenerateImage}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                <p>This preview shows how your LinkedIn ad might appear. Actual appearance may vary.</p>
                <p className="mt-2">Note: Images generated in test mode don't consume credits and are for preview purposes only.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedInAdsTestArea;
