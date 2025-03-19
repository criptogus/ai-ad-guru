
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GoogleAd } from "@/hooks/adGeneration";
import { useAdGeneration } from "@/hooks/useAdGeneration";
import GoogleAdCard from "@/components/campaign/ad-preview/GoogleAdCard";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const defaultAnalysisResult = {
  companyName: "Test Company",
  businessDescription: "A test company for debugging purposes",
  websiteUrl: "https://example.com",
  brandTone: "Professional",
  targetAudience: "Developers and testers",
  uniqueSellingPoints: ["Easy debugging", "Fast testing", "Reliable results"],
  callToAction: ["Test Now"],  // Using array format for callToAction
  keywords: ["test", "debug", "development"]
};

const GoogleAdsTestArea: React.FC = () => {
  const [googleAds, setGoogleAds] = useState<GoogleAd[]>([]);
  const [newAd, setNewAd] = useState<GoogleAd>({
    headlines: ["Test Company", "Professional Services", "Get Started Today"],
    descriptions: ["We provide top-quality testing services for your business. Fast and reliable.", "Contact us now to learn how we can help improve your workflow."]
  });

  const handleAddTestAd = () => {
    const updatedAds = [...googleAds, { ...newAd }];
    setGoogleAds(updatedAds);
    toast.success("Test Google ad added");
  };

  const handleUpdateAd = (index: number, updatedAd: GoogleAd) => {
    console.log(`Updating Google ad at index ${index}:`, updatedAd);
    const newAds = [...googleAds];
    newAds[index] = updatedAd;
    setGoogleAds(newAds);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Google Ads Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Headlines</Label>
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <Input 
                  key={i}
                  value={newAd.headlines[i] || ""}
                  onChange={(e) => {
                    const updatedHeadlines = [...newAd.headlines];
                    updatedHeadlines[i] = e.target.value;
                    setNewAd({...newAd, headlines: updatedHeadlines});
                  }}
                  placeholder={`Headline ${i+1}`}
                />
              ))}
            </div>
          </div>
          
          <div>
            <Label>Descriptions</Label>
            <div className="space-y-2">
              {[0, 1].map((i) => (
                <Input 
                  key={i}
                  value={newAd.descriptions[i] || ""}
                  onChange={(e) => {
                    const updatedDescriptions = [...newAd.descriptions];
                    updatedDescriptions[i] = e.target.value;
                    setNewAd({...newAd, descriptions: updatedDescriptions});
                  }}
                  placeholder={`Description ${i+1}`}
                />
              ))}
            </div>
          </div>
          
          <Button onClick={handleAddTestAd}>Add Test Google Ad</Button>
        </CardContent>
      </Card>
      
      <Separator />
      
      {/* Display generated ads */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Test Google Ads ({googleAds.length})</h2>
        
        {googleAds.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p>No test Google ads created yet. Add one above.</p>
          </div>
        ) : (
          googleAds.map((ad, index) => (
            <GoogleAdCard 
              key={index}
              ad={ad}
              index={index}
              analysisResult={defaultAnalysisResult}
              onUpdate={(updatedAd) => handleUpdateAd(index, updatedAd)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GoogleAdsTestArea;
