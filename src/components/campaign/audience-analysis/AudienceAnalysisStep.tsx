
import React, { useState, useEffect } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { useAudienceAnalysis, AudienceAnalysisResult } from "@/hooks/useAudienceAnalysis";
import AudienceAnalysisPanel from "./AudienceAnalysisPanel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCampaign } from "@/contexts/CampaignContext";
import { FormProvider, useForm } from "react-hook-form";

interface AudienceAnalysisStepProps {
  analysisResult: WebsiteAnalysisResult | null;
  onBack: () => void;
  onNext: (data?: any) => void;
}

const AudienceAnalysisStep: React.FC<AudienceAnalysisStepProps> = ({
  analysisResult,
  onBack,
  onNext
}) => {
  const { analyzeAudience, isAnalyzing, analysisResult: audienceResult, cacheInfo, setAnalysisResult } = useAudienceAnalysis();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const { setAudienceAnalysisResult, setAudienceCacheInfo } = useCampaign();
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  // Initialize form for any form controls in AudienceAnalysisPanel
  const methods = useForm({
    defaultValues: {
      platform: "all"
    }
  });

  const handleAnalyze = async (platform?: string) => {
    if (!analysisResult) {
      setAnalysisError("Website analysis result is required");
      return;
    }
    
    setAnalysisError(null);
    setSelectedPlatform(platform || "all");
    
    try {
      const result = await analyzeAudience(analysisResult, platform);
      
      // Update the campaign context with the analysis result
      if (result) {
        setAudienceAnalysisResult(result);
        if (cacheInfo) {
          setAudienceCacheInfo(cacheInfo);
        }
      } else {
        setAnalysisError("Failed to analyze audience");
      }
    } catch (error) {
      console.error("Error analyzing audience:", error);
      setAnalysisError(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

  // Run initial analysis when component mounts
  useEffect(() => {
    if (analysisResult && !audienceResult && !isAnalyzing) {
      handleAnalyze().catch(err => {
        console.error("Error in initial audience analysis:", err);
        setAnalysisError(err instanceof Error ? err.message : "Failed to analyze audience");
      });
    }
  }, [analysisResult, audienceResult, isAnalyzing]);

  const handleNextClick = () => {
    console.log("AudienceAnalysisStep: Next button clicked");
    console.log("Audience analysis result:", audienceResult);
    
    // Pass the audience analysis data to the next step
    if (audienceResult) {
      const audienceData = {
        audienceAnalysis: audienceResult,
        audienceCacheInfo: cacheInfo
      };
      
      // Call onNext with the data 
      onNext(audienceData);
    } else {
      // If no analysis result yet, just proceed to next step
      onNext();
    }
  };

  return (
    <FormProvider {...methods}>
      <Card className="shadow-md border border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Audience Analysis</CardTitle>
          </div>
          <CardDescription>
            Let our AI analyze your website content to identify the perfect audience for your ads
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-4">
          {analysisError && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md">
              <p className="text-sm">Error: {analysisError}</p>
            </div>
          )}
          
          {analysisResult && (
            <AudienceAnalysisPanel
              websiteData={analysisResult}
              isAnalyzing={isAnalyzing}
              analysisResult={audienceResult}
              onAnalyze={handleAnalyze}
              selectedPlatform={selectedPlatform}
              cacheInfo={cacheInfo}
            />
          )}
          
          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <Button variant="outline" onClick={onBack} className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <span className="text-sm text-muted-foreground">
              Step 4 of 7
            </span>
            
            <Button 
              onClick={handleNextClick} 
              className="flex items-center" 
              disabled={!audienceResult}
            >
              Next Step
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

export default AudienceAnalysisStep;
