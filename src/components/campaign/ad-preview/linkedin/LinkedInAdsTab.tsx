
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import LinkedInAdsList from "./LinkedInAdsList";
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
  onMindTriggerChange?: (trigger: string) => void;
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
  onMindTriggerChange
}) => {
  // Get form context
  const formMethods = useFormContext();
  
  // Initialize linkedInAds field if form context exists
  useEffect(() => {
    if (formMethods && Array.isArray(linkedInAds)) {
      // Ensure the linkedInAds field exists in the form
      formMethods.setValue("linkedInAds", linkedInAds);
    }
  }, [linkedInAds, formMethods]);

  const handleUpdateAd = (index: number, updatedAd: MetaAd) => {
    onUpdateLinkedInAd(index, updatedAd);
    
    // Update the form value if we have form context
    if (formMethods) {
      try {
        const currentAds = formMethods.getValues("linkedInAds") || [];
        const updatedAds = [...currentAds];
        updatedAds[index] = updatedAd;
        formMethods.setValue("linkedInAds", updatedAds);
      } catch (error) {
        console.error("Error updating form value:", error);
      }
    }
  };

  return (
    <div>
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

      {linkedInAds.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
            Generate LinkedIn ads based on your website content and mind triggers. Our AI will create professional ad content optimized for business audiences.
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
              <>Generate LinkedIn Ads</>
            )}
          </Button>
          {mindTrigger && (
            <div className="mt-4 text-sm p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
              <span className="font-medium">Using mind trigger:</span> {mindTrigger}
            </div>
          )}
        </div>
      ) : (
        <LinkedInAdsList
          ads={linkedInAds}
          analysisResult={analysisResult}
          loadingImageIndex={loadingImageIndex}
          isGenerating={isGenerating}
          onGenerateAds={onGenerateAds}
          onGenerateImage={onGenerateImage}
          onUpdateAd={handleUpdateAd}
          onDuplicate={(index) => {
            if (linkedInAds && linkedInAds.length > 0) {
              const adToDuplicate = linkedInAds[index];
              const newAd = { ...adToDuplicate };
              const newAds = [...linkedInAds, newAd];
              
              // Update form if available
              if (formMethods) {
                try {
                  formMethods.setValue("linkedInAds", newAds);
                } catch (error) {
                  console.error("Error updating linkedInAds in form:", error);
                }
              }
            }
          }}
          onDelete={(index) => {
            if (linkedInAds && linkedInAds.length > 0) {
              const newAds = [...linkedInAds];
              newAds.splice(index, 1);
              
              // Update form if available
              if (formMethods) {
                try {
                  formMethods.setValue("linkedInAds", newAds);
                } catch (error) {
                  console.error("Error updating linkedInAds in form:", error);
                }
              }
            }
          }}
          mindTrigger={mindTrigger}
          onMindTriggerChange={onMindTriggerChange}
        />
      )}
    </div>
  );
};

export default LinkedInAdsTab;
