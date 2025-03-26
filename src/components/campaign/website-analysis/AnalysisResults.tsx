
import React from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import CompanyInfoEditor from "./CompanyInfoEditor";
import TargetAudienceEditor from "./TargetAudienceEditor";
import KeywordsEditor from "./KeywordsEditor";
import UspEditor from "./UspEditor";
import CtaEditor from "./CtaEditor";

interface AnalysisResultsProps {
  analysisResult: WebsiteAnalysisResult;
  onTextChange: (field: keyof WebsiteAnalysisResult, value: string) => void;
  onArrayItemChange: (
    field: 'keywords' | 'callToAction' | 'uniqueSellingPoints', 
    index: number, 
    value: string
  ) => void;
  onNext: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysisResult,
  onTextChange,
  onArrayItemChange,
  onNext,
}) => {
  // Helper functions to adapt to component-specific props
  const handleTargetAudienceChange = (value: string) => {
    onTextChange('targetAudience', value);
  };

  const handleKeywordChange = (index: number, value: string) => {
    onArrayItemChange('keywords', index, value);
  };

  const handleUspChange = (index: number, value: string) => {
    onArrayItemChange('uniqueSellingPoints', index, value);
  };

  const handleCtaChange = (index: number, value: string) => {
    onArrayItemChange('callToAction', index, value);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-lg border bg-card text-card-foreground">
        <h3 className="text-lg font-medium mb-4">Analysis Results</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Our AI has analyzed your website. Review and edit the information below before continuing.
        </p>
        
        <ScrollArea className="h-[420px] pr-4">
          <div className="space-y-6">
            <CompanyInfoEditor 
              analysisResult={analysisResult}
              onTextChange={onTextChange}
            />
            
            <TargetAudienceEditor 
              targetAudience={analysisResult.targetAudience}
              onChange={handleTargetAudienceChange}
            />
            
            <KeywordsEditor 
              keywords={analysisResult.keywords}
              onKeywordChange={handleKeywordChange}
            />
            
            <UspEditor 
              uniqueSellingPoints={analysisResult.uniqueSellingPoints}
              onUspChange={handleUspChange}
            />
            
            <CtaEditor 
              callToActions={analysisResult.callToAction}
              onCtaChange={handleCtaChange}
            />
          </div>
        </ScrollArea>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={onNext}>
            Continue to Platform Selection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
