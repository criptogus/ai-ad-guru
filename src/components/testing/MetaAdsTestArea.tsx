
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { MetaAd } from "@/hooks/adGeneration";
import { useAdGeneration } from "@/hooks/useAdGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import NewMetaAdForm from "./meta/NewMetaAdForm";
import ImageLoadingTest from "./meta/ImageLoadingTest";
import TestMetaAdsList from "./meta/TestMetaAdsList";

const defaultAnalysisResult: WebsiteAnalysisResult = {
  companyName: "Test Company",
  businessDescription: "A test company for debugging purposes",
  websiteUrl: "https://example.com",
  brandTone: "Professional",
  targetAudience: "Developers and testers",
  uniqueSellingPoints: ["Easy debugging", "Fast testing", "Reliable results"],
  callToAction: ["Test Now"],
  keywords: ["test", "debug", "development"]
};

const MetaAdsTestArea: React.FC = () => {
  const { generateAdImage } = useAdGeneration();
  const [metaAds, setMetaAds] = useState<MetaAd[]>([]);
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);
  const [newAd, setNewAd] = useState<MetaAd>({
    primaryText: "Discover how our service can transform your business! 🚀",
    headline: "Innovate and Lead the Future",
    description: "Curious about how we can help? Click to learn more!",
    imagePrompt: "A professional team collaborating in a modern office with digital displays showing success metrics and growth charts"
  });

  // Debug image loading
  const [debugImageUrl, setDebugImageUrl] = useState("");
  const [debugImageLoaded, setDebugImageLoaded] = useState(false);
  const [debugImageError, setDebugImageError] = useState(false);

  const handleAddTestAd = () => {
    const updatedAds = [...metaAds, { ...newAd }];
    setMetaAds(updatedAds);
    toast.success("Test ad added");
  };

  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    try {
      setLoadingImageIndex(index);
      
      console.log("Generating image with prompt:", ad.imagePrompt);
      const imageUrl = await generateAdImage(ad.imagePrompt);
      
      if (imageUrl) {
        console.log("Image generated successfully:", imageUrl);
        
        // Create a new array with the updated ad
        const updatedAds = [...metaAds];
        updatedAds[index] = { ...ad, imageUrl };
        setMetaAds(updatedAds);
        
        toast.success("Image generated successfully");
      } else {
        console.error("Failed to generate image - null response");
        toast.error("Failed to generate image");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Error generating image");
    } finally {
      setLoadingImageIndex(null);
    }
  };

  const handleUpdateAd = (index: number, updatedAd: MetaAd) => {
    console.log(`Updating ad at index ${index}:`, updatedAd);
    const newAds = [...metaAds];
    newAds[index] = updatedAd;
    setMetaAds(newAds);
  };

  const handleTestImageLoad = (url: string) => {
    setDebugImageUrl(url);
    setDebugImageLoaded(false);
    setDebugImageError(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Meta/Instagram Ads Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NewMetaAdForm 
            newAd={newAd}
            setNewAd={setNewAd}
            onAddTestAd={handleAddTestAd}
          />
        </CardContent>
      </Card>
      
      {/* Test area for direct image loading */}
      <Card>
        <CardHeader>
          <CardTitle>Image Loading Test</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageLoadingTest 
            debugImageUrl={debugImageUrl}
            setDebugImageUrl={setDebugImageUrl}
            handleTestImageLoad={handleTestImageLoad}
            debugImageLoaded={debugImageLoaded}
            debugImageError={debugImageError}
          />
        </CardContent>
      </Card>
      
      <Separator />
      
      {/* Display generated ads */}
      <TestMetaAdsList 
        metaAds={metaAds}
        defaultAnalysisResult={defaultAnalysisResult}
        loadingImageIndex={loadingImageIndex}
        handleGenerateImage={handleGenerateImage}
        handleUpdateAd={handleUpdateAd}
      />
    </div>
  );
};

export default MetaAdsTestArea;
