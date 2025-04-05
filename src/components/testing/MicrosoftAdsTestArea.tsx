import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { GoogleAd } from "@/hooks/adGeneration/types";
import { MicrosoftAdPreview } from "@/components/campaign/ad-preview/microsoft";

const MicrosoftAdsTestArea: React.FC = () => {
  const [testAd, setTestAd] = useState<GoogleAd>({
    headline1: "Microsoft Ad Headline 1",
    headline2: "Second Headline Here",
    headline3: "Final Call To Action",
    description1: "This is the first description line that explains your business value proposition to Bing users.",
    description2: "This is the second description line with more details about your services for Microsoft users.",
    path1: "services",
    path2: "offers",
    headlines: [
      "Microsoft Ad Headline 1",
      "Second Headline Here",
      "Final Call To Action"
    ],
    descriptions: [
      "This is the first description line that explains your business value proposition to Bing users.",
      "This is the second description line with more details about your services for Microsoft users."
    ]
  });
  
  const [domain, setDomain] = useState("yourbusiness.com");

  const handleHeadlineChange = (index: number, value: string) => {
    const newHeadlines = [...testAd.headlines!];
    newHeadlines[index] = value;
    
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
      headline1: "Microsoft Ad Headline 1",
      headline2: "Second Headline Here",
      headline3: "Final Call To Action",
      description1: "This is the first description line that explains your business value proposition to Bing users.",
      description2: "This is the second description line with more details about your services for Microsoft users.",
      path1: "services",
      path2: "offers",
      headlines: [
        "Microsoft Ad Headline 1",
        "Second Headline Here",
        "Final Call To Action"
      ],
      descriptions: [
        "This is the first description line that explains your business value proposition to Bing users.",
        "This is the second description line with more details about your services for Microsoft users."
      ]
    });
    setDomain("yourbusiness.com");
    toast.info("Test ad reset to default values");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Microsoft Ads Test</CardTitle>
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
                <MicrosoftAdPreview ad={testAd} domain={domain} />
              </div>
              <div className="text-xs text-muted-foreground">
                <p>This preview shows how your Microsoft/Bing ad might appear. Actual appearance may vary.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MicrosoftAdsTestArea;
