
import React from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { useAudienceAnalysis, AudienceAnalysisResult } from "@/hooks/useAudienceAnalysis";
import AudienceAnalysisPanel from "./AudienceAnalysisPanel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AudienceAnalysisStepProps {
  analysisResult: WebsiteAnalysisResult | null;
  onBack: () => void;
  onNext: () => void;
}

const AudienceAnalysisStep: React.FC<AudienceAnalysisStepProps> = ({
  analysisResult,
  onBack,
  onNext
}) => {
  const { analyzeAudience, isAnalyzing, analysisResult: audienceResult } = useAudienceAnalysis();

  const handleAnalyze = async (platform?: string) => {
    if (!analysisResult) return;
    
    await analyzeAudience(analysisResult, platform);
  };

  return (
    <div className="space-y-6">
      <AudienceAnalysisPanel
        websiteData={analysisResult!}
        isAnalyzing={isAnalyzing}
        analysisResult={audienceResult}
        onAnalyze={handleAnalyze}
      />
      
      <div className="pt-4 border-t flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext}>
          Next Step
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AudienceAnalysisStep;
