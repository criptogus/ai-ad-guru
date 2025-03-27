
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFormContext } from "react-hook-form";

interface LinkedInAdsTabProps {
  linkedInAds: MetaAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateAds: () => Promise<void>;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateLinkedInAd: (index: number, updatedAd: MetaAd) => void;
  mindTrigger?: string;
}

const LinkedInAdsTab: React.FC<LinkedInAdsTabProps> = ({
  linkedInAds,
  analysisResult,
  isGenerating,
  loadingImageIndex,
  onGenerateAds,
  onGenerateImage,
  onUpdateLinkedInAd,
  mindTrigger,
}) => {
  const [editingAdIndex, setEditingAdIndex] = useState<number | null>(null);
  const [localAds, setLocalAds] = useState<MetaAd[]>([]);
  const formContext = useFormContext(); // To check if we're in a form context

  useEffect(() => {
    setLocalAds(linkedInAds);
  }, [linkedInAds]);

  const handleEditAd = (index: number) => {
    setEditingAdIndex(index);
  };

  const handleSaveAd = (index: number, updatedAd: MetaAd) => {
    const newAds = [...localAds];
    newAds[index] = updatedAd;
    setLocalAds(newAds);
    onUpdateLinkedInAd(index, updatedAd);
    setEditingAdIndex(null);
    
    toast.success("LinkedIn ad updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingAdIndex(null);
    setLocalAds(linkedInAds);
  };

  const handleCopyAd = (ad: MetaAd) => {
    const text = `Headline: ${ad.headline}\n\nPrimary Text: ${ad.primaryText}\n\nDescription: ${ad.description}`;
    
    navigator.clipboard.writeText(text);
    toast.success("LinkedIn ad text copied to clipboard");
  };

  const handleGenerateImage = async (ad: MetaAd, index: number): Promise<void> => {
    try {
      return await onGenerateImage(ad, index);
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      {mindTrigger && (
        <Alert className="mb-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <AlertTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
            Active Mind Trigger
          </AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-300">
            {mindTrigger}
          </AlertDescription>
        </Alert>
      )}
      
      {linkedInAds.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4 py-6">
              <h3 className="text-lg font-medium">No LinkedIn Ads Created Yet</h3>
              <p className="text-muted-foreground">
                Generate LinkedIn ads based on your website analysis.
              </p>
              <Button 
                onClick={onGenerateAds} 
                disabled={isGenerating}
                className="mt-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Ads...
                  </>
                ) : (
                  "Generate LinkedIn Ads"
                )}
              </Button>
              <div className="text-xs text-muted-foreground mt-2">
                This will use 5 credits
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">LinkedIn Ad Variations</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateAds}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                "Regenerate Ads"
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {localAds.map((ad, index) => (
              <div key={index} className="border rounded-md p-4">
                <h3 className="font-medium text-lg">{ad.headline}</h3>
                <p className="mt-2 text-sm">{ad.primaryText}</p>
                {ad.imageUrl && (
                  <div className="mt-3">
                    <img 
                      src={ad.imageUrl} 
                      alt={ad.headline} 
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                )}
                <div className="mt-3 flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditAd(index)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCopyAd(ad)}
                  >
                    Copy Text
                  </Button>
                  {!ad.imageUrl && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGenerateImage(ad, index)}
                      disabled={loadingImageIndex === index}
                    >
                      {loadingImageIndex === index ? (
                        <>
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Image"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LinkedInAdsTab;
