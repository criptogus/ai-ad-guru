
import React from "react";
import { WebsiteAnalysisResult, AnalysisCache } from "@/hooks/useWebsiteAnalysis";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import CompanyInfoEditor from "./CompanyInfoEditor";
import TargetAudienceEditor from "./TargetAudienceEditor";
import KeywordsEditor from "./KeywordsEditor";
import UspEditor from "./UspEditor";
import CtaEditor from "./CtaEditor";
import { format } from "date-fns";

interface AnalysisResultsProps {
  analysisResult: WebsiteAnalysisResult;
  onTextChange: (field: keyof WebsiteAnalysisResult, value: string) => void;
  onArrayItemChange: (
    field: 'keywords' | 'callToAction' | 'uniqueSellingPoints', 
    index: number, 
    value: string
  ) => void;
  onNext: () => void;
  cacheInfo?: AnalysisCache | null;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysisResult,
  onTextChange,
  onArrayItemChange,
  onNext,
  cacheInfo
}) => {
  // Helper functions to adapt to component-specific props
  const handleTargetAudienceChange = (value: string) => {
    onTextChange('targetAudience', value);
  };

  const handleKeywordChange = (index: number, value: string) => {
    onArrayItemChange('keywords', index, value);
  };

  const handleUspChange = (index: number, value: string) => {
    onArrayItemChange('uniqueSellingPoints' as 'keywords', index, value);
  };

  const handleCtaChange = (index: number, value: string) => {
    onArrayItemChange('callToAction' as 'keywords', index, value);
  };

  const formatCacheDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };
  
  // Calculate days remaining in cache if fromCache is true
  const getDaysRemaining = () => {
    if (!cacheInfo?.fromCache || !cacheInfo.expiresAt) return null;
    
    try {
      const today = new Date();
      const expiresAt = new Date(cacheInfo.expiresAt);
      const diffTime = expiresAt.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays > 0 ? diffDays : 0;
    } catch (e) {
      console.error("Error calculating days remaining:", e);
      return null;
    }
  };
  
  const daysRemaining = getDaysRemaining();

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-lg border bg-card text-card-foreground">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
          <h3 className="text-lg font-medium">Analysis Results</h3>
          
          {cacheInfo?.fromCache && cacheInfo.cachedAt && (
            <Badge variant="outline" className="flex items-center gap-1 bg-amber-100/10 text-xs px-2 py-1 h-auto">
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                Cached {formatCacheDate(cacheInfo.cachedAt)}
                {daysRemaining !== null && ` · ${daysRemaining} days remaining`}
              </span>
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {cacheInfo?.fromCache 
            ? "Using cached analysis from our database. Review and edit the information below before continuing."
            : "Our AI has analyzed your website. Review and edit the information below before continuing."}
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
              uniqueSellingPoints={analysisResult.uniqueSellingPoints || []}
              onUspChange={handleUspChange}
            />
            
            <CtaEditor 
              callToActions={analysisResult.callToAction || []}
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
