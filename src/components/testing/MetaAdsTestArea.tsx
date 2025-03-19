
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MetaAd } from "@/hooks/adGeneration";
import { useAdGeneration } from "@/hooks/useAdGeneration";
import MetaAdCard from "@/components/campaign/ad-preview/meta/card/MetaAdCard";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const defaultAnalysisResult = {
  companyName: "Test Company",
  businessDescription: "A test company for debugging purposes",
  websiteUrl: "https://example.com",
  brandTone: "Professional",
  targetAudience: "Developers and testers",
  uniqueSellingPoints: ["Easy debugging", "Fast testing", "Reliable results"],
  callToAction: "Test Now",
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
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryText">Primary Text</Label>
              <Textarea 
                id="primaryText" 
                value={newAd.primaryText}
                onChange={(e) => setNewAd({...newAd, primaryText: e.target.value})}
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="headline">Headline</Label>
              <Input 
                id="headline" 
                value={newAd.headline}
                onChange={(e) => setNewAd({...newAd, headline: e.target.value})}
              />
              
              <Label htmlFor="description" className="mt-4">Description</Label>
              <Input 
                id="description" 
                value={newAd.description}
                onChange={(e) => setNewAd({...newAd, description: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="imagePrompt">Image Prompt</Label>
            <Textarea 
              id="imagePrompt" 
              value={newAd.imagePrompt}
              onChange={(e) => setNewAd({...newAd, imagePrompt: e.target.value})}
              className="min-h-[100px]"
            />
          </div>
          
          <Button onClick={handleAddTestAd}>Add Test Ad</Button>
        </CardContent>
      </Card>
      
      {/* Test area for direct image loading */}
      <Card>
        <CardHeader>
          <CardTitle>Image Loading Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="imageUrl">Image URL to Test</Label>
              <div className="flex gap-2">
                <Input 
                  id="imageUrl" 
                  value={debugImageUrl}
                  onChange={(e) => setDebugImageUrl(e.target.value)}
                  placeholder="Enter image URL to test loading"
                />
                <Button onClick={() => handleTestImageLoad(debugImageUrl)}>Test</Button>
              </div>
              
              <div className="mt-4">
                <p>Status: {debugImageLoaded ? "✅ Loaded" : debugImageError ? "❌ Error" : "⏳ Not loaded yet"}</p>
                {debugImageUrl && (
                  <div className="text-xs mt-2 break-all">
                    <p>URL: {debugImageUrl}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-100 aspect-square relative overflow-hidden">
              {debugImageUrl ? (
                <img 
                  src={debugImageUrl}
                  alt="Test image"
                  className="w-full h-full object-cover"
                  onLoad={() => setDebugImageLoaded(true)}
                  onError={() => setDebugImageError(true)}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Enter an image URL to test
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Separator />
      
      {/* Display generated ads */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Test Ads ({metaAds.length})</h2>
        
        {metaAds.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p>No test ads created yet. Add one above.</p>
          </div>
        ) : (
          metaAds.map((ad, index) => (
            <MetaAdCard 
              key={index}
              ad={ad}
              index={index}
              analysisResult={defaultAnalysisResult}
              loadingImageIndex={loadingImageIndex}
              onGenerateImage={handleGenerateImage}
              onUpdate={handleUpdateAd}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MetaAdsTestArea;
