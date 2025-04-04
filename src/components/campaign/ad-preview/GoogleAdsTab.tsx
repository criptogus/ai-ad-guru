
import React, { useState } from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFormContext } from "react-hook-form";

interface GoogleAdsTabProps {
  googleAds: GoogleAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  onGenerateAds: () => Promise<void>;
  onUpdateGoogleAd: (index: number, updatedAd: GoogleAd) => void;
  mindTrigger?: string;
}

const GoogleAdsTab: React.FC<GoogleAdsTabProps> = ({
  googleAds = [], // Provide default empty array
  analysisResult,
  isGenerating,
  onGenerateAds,
  onUpdateGoogleAd,
  mindTrigger
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const formMethods = useFormContext();
  
  // If we have form context, ensure googleAds field exists
  if (formMethods && !formMethods.getValues("googleAds")) {
    formMethods.setValue("googleAds", Array.isArray(googleAds) ? googleAds : []);
  }
  
  const handleUpdateAd = (index: number, updatedAd: GoogleAd) => {
    onUpdateGoogleAd(index, updatedAd);
    
    // Update form context if available
    if (formMethods) {
      const currentAds = formMethods.getValues("googleAds") || [];
      const updatedAds = [...currentAds];
      updatedAds[index] = updatedAd;
      formMethods.setValue("googleAds", updatedAds);
    }
  };

  // Ensure googleAds is always an array
  const adsArray = Array.isArray(googleAds) ? googleAds : [];

  return (
    <div className="space-y-6">
      {mindTrigger && (
        <Alert className="mb-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <AlertTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Active Mind Trigger
          </AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-300">
            {mindTrigger}
          </AlertDescription>
        </Alert>
      )}
    
      {adsArray.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
            Generate Google ads based on your website content and mind triggers. Our AI will create optimized headline and description variations.
          </p>
          <Button 
            onClick={onGenerateAds} 
            disabled={isGenerating}
            className="min-w-[200px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Ads...
              </>
            ) : (
              <>Generate Google Ads</>
            )}
          </Button>
          {mindTrigger && (
            <div className="mt-4 text-sm p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
              <span className="font-medium">Using mind trigger:</span> {mindTrigger}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Google Ads</h3>
            <Button 
              onClick={onGenerateAds} 
              variant="outline" 
              size="sm"
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
          
          <div className="space-y-4">
            {adsArray.map((ad, index) => (
              <div key={index} className="border rounded-md p-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-600">
                    {ad.headline1 || ad.headlines?.[0] || ""} | {ad.headline2 || ad.headlines?.[1] || ""} | {ad.headline3 || ad.headlines?.[2] || ""}
                  </h4>
                  <div className="text-green-700 text-sm">
                    {analysisResult.websiteUrl && new URL(analysisResult.websiteUrl).hostname}
                  </div>
                  <div className="text-sm">{ad.description1 || ad.descriptions?.[0] || ""}</div>
                  {(ad.description2 || ad.descriptions?.[1]) && <div className="text-sm">{ad.description2 || ad.descriptions?.[1]}</div>}
                </div>
                <div className="mt-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setEditingIndex(index === editingIndex ? null : index);
                    }}
                  >
                    {index === editingIndex ? "Cancel Edit" : "Edit Ad"}
                  </Button>
                </div>
                
                {index === editingIndex && (
                  <div className="mt-4 space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    {/* Edit form fields would go here */}
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setEditingIndex(null);
                        // Update the ad with any changes
                        handleUpdateAd(index, ad);
                      }}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleAdsTab;
