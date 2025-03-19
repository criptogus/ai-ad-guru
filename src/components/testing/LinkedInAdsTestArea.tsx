
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

const LinkedInAdsTestArea: React.FC = () => {
  const [testAd, setTestAd] = useState<MetaAd>({
    headline: "Transform Your Business with Our Solutions",
    primaryText: "Looking to optimize your business processes and increase productivity? Our proven solutions have helped hundreds of companies achieve their goals and grow their business.",
    description: "Schedule a demo today and see how we can help your team succeed.",
    imagePrompt: "A professional team working together in a modern office environment",
    imageUrl: ""
  });
  
  const [companyInfo, setCompanyInfo] = useState<WebsiteAnalysisResult>(defaultAnalysisResult);

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
    toast.info("Test ad reset to default values");
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

              <Button onClick={handleReset} variant="outline">Reset to Default</Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Ad Preview</h3>
              <div className="border rounded-md p-4 bg-gray-50">
                <LinkedInAdPreview 
                  ad={testAd} 
                  analysisResult={companyInfo}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                <p>This preview shows how your LinkedIn ad might appear. Actual appearance may vary.</p>
                <p className="mt-2">Note: Image generation is not available in test mode. Only text content can be previewed.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedInAdsTestArea;
