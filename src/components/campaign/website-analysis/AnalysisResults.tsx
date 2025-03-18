
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import CompanyInfoEditor from "./CompanyInfoEditor";
import TargetAudienceEditor from "./TargetAudienceEditor";
import KeywordsEditor from "./KeywordsEditor";
import CtaEditor from "./CtaEditor";
import UspEditor from "./UspEditor";

interface AnalysisResultsProps {
  analysisResult: WebsiteAnalysisResult;
  onTextChange: (field: keyof WebsiteAnalysisResult, value: string) => void;
  onArrayItemChange: (field: 'keywords' | 'callToAction' | 'uniqueSellingPoints', index: number, value: string) => void;
  onNext: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysisResult,
  onTextChange,
  onArrayItemChange,
  onNext
}) => {
  return (
    <div className="mt-6 space-y-6 rounded-lg border border-green-200 bg-green-50 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle size={20} />
          <h3 className="font-medium text-lg">Analysis Complete</h3>
        </div>
        <Button 
          onClick={onNext}
          variant="default"
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          Next Step
          <ArrowRight size={16} />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompanyInfoEditor 
          analysisResult={analysisResult} 
          onTextChange={onTextChange} 
        />
        
        <TargetAudienceEditor 
          targetAudience={analysisResult.targetAudience} 
          onChange={(value) => onTextChange('targetAudience', value)} 
        />
        
        <KeywordsEditor 
          keywords={analysisResult.keywords} 
          onKeywordChange={(index, value) => onArrayItemChange('keywords', index, value)} 
        />
        
        <CtaEditor 
          callToActions={analysisResult.callToAction} 
          onCtaChange={(index, value) => onArrayItemChange('callToAction', index, value)} 
        />
        
        <UspEditor 
          uniqueSellingPoints={analysisResult.uniqueSellingPoints} 
          onUspChange={(index, value) => onArrayItemChange('uniqueSellingPoints', index, value)} 
        />
      </div>
    </div>
  );
};

export default AnalysisResults;
