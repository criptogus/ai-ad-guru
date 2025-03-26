
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { GoogleAd } from "@/hooks/useAdGeneration";
import GoogleAdPreview from "@/components/campaign/ad-preview/google/GoogleAdPreview";

const GoogleAdsTestArea: React.FC = () => {
  const [testAd, setTestAd] = useState<GoogleAd>({
    headline1: "Google Ad Headline 1",
    headline2: "Second Headline Here",
    headline3: "Final Call To Action",
    description1: "This is the first description line that explains what your product or service does and why people should care.",
    description2: "This is the second description line with additional details about features, benefits, or special offers.",
    headlines: [
      "Google Ad Headline 1",
      "Second Headline Here",
      "Final Call To Action"
    ],
    descriptions: [
      "This is the first description line that explains what your product or service does and why people should care.",
      "This is the second description line with additional details about features, benefits, or special offers."
    ]
  });
  
  const [domain, setDomain] = useState("yourbusiness.com");

  const handleHeadlineChange = (index: number, value: string) => {
    const newHeadlines = [...testAd.headlines!];
    newHeadlines[index] = value;
    
    // Also update the individual headline properties
    const updatedAd = { 
      ...testAd, 
      headlines: newHeadlines 
    };
    
    if (index === 0) updatedAd.headline1 = value;
    if (index === 1) updatedAd.headline2 = value;
    if (index === 2) updatedAd.headline3 = value;
    
    setTestAd(updatedAd);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescriptions = [...testAd.descriptions!];
    newDescriptions[index] = value;
    
    // Also update the individual description properties
    const updatedAd = { 
      ...testAd, 
      descriptions: newDescriptions 
    };
    
    if (index === 0) updatedAd.description1 = value;
    if (index === 1) updatedAd.description2 = value;
    
    setTestAd(updatedAd);
  };

  const handleReset = () => {
    setTestAd({
      headline1: "Google Ad Headline 1",
      headline2: "Second Headline Here",
      headline3: "Final Call To Action",
      description1: "This is the first description line that explains what your product or service does and why people should care.",
      description2: "This is the second description line with additional details about features, benefits, or special offers.",
      headlines: [
        "Google Ad Headline 1",
        "Second Headline Here",
        "Final Call To Action"
      ],
      descriptions: [
        "This is the first description line that explains what your product or service does and why people should care.",
        "This is the second description line with additional details about features, benefits, or special offers."
      ]
    });
    setDomain("yourbusiness.com");
    toast.info("Test ad reset to default values");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Google Ads Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="domain">Domain</Label>
                <Input 
                  id="domain" 
                  value={domain} 
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="yourbusiness.com"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Headlines (30 chars max)</h3>
                {testAd.headlines.map((headline, index) => (
                  <div key={`headline-${index}`}>
                    <Label htmlFor={`headline-${index}`}>Headline {index + 1}</Label>
                    <Input
                      id={`headline-${index}`}
                      value={headline}
                      onChange={(e) => handleHeadlineChange(index, e.target.value)}
                      maxLength={30}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {headline.length}/30 characters
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Descriptions (90 chars max)</h3>
                {testAd.descriptions.map((description, index) => (
                  <div key={`description-${index}`}>
                    <Label htmlFor={`description-${index}`}>Description {index + 1}</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={description}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      maxLength={90}
                      rows={2}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {description.length}/90 characters
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={handleReset} variant="outline">Reset to Default</Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Ad Preview</h3>
              <div className="border rounded-md p-4 bg-gray-50">
                <GoogleAdPreview ad={testAd} domain={domain} />
              </div>
              <div className="text-xs text-muted-foreground">
                <p>This preview shows how your Google Search ad might appear. Actual appearance may vary.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleAdsTestArea;
