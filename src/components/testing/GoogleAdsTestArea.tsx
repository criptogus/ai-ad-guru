
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { GoogleAd } from "@/hooks/adGeneration";
import NewGoogleAdForm from "./google/NewGoogleAdForm";
import GoogleAdCard from "@/components/campaign/ad-preview/GoogleAdCard";

// Sample data for testing
const defaultBusiness = {
  name: "Test Company",
  description: "A test business for ad previews",
  url: "www.example.com"
};

const GoogleAdsTestArea: React.FC = () => {
  const [googleAds, setGoogleAds] = useState<GoogleAd[]>([]);
  const [newAd, setNewAd] = useState<GoogleAd>({
    headline1: "Test Headline 1",
    headline2: "Test Headline 2",
    headline3: "Test Headline 3",
    description1: "Test description line 1 for the ad.",
    description2: "Test description line 2 for the ad.",
    path1: "path1",
    path2: "path2",
    finalUrl: "https://example.com",
  });

  const handleAddTestAd = () => {
    const updatedAds = [...googleAds, { ...newAd }];
    setGoogleAds(updatedAds);
    toast.success("Test ad added");
  };

  const handleRemoveAd = (index: number) => {
    const updatedAds = [...googleAds];
    updatedAds.splice(index, 1);
    setGoogleAds(updatedAds);
    toast.info("Ad removed");
  };

  const handleUpdateAd = (index: number, updatedAd: GoogleAd) => {
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
          <NewGoogleAdForm 
            newAd={newAd}
            setNewAd={setNewAd}
            onAddTestAd={handleAddTestAd}
          />
        </CardContent>
      </Card>
      
      <Separator />
      
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Test Ads ({googleAds.length})</h2>
        
        {googleAds.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p>No test ads created yet. Add one above.</p>
          </div>
        ) : (
          googleAds.map((ad, index) => (
            <GoogleAdCard 
              key={index} 
              ad={ad} 
              index={index} 
              displayUrl={`${defaultBusiness.url}/${ad.path1}/${ad.path2}`}
              onRemove={() => handleRemoveAd(index)}
              onUpdate={(updatedAd) => handleUpdateAd(index, updatedAd)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GoogleAdsTestArea;
