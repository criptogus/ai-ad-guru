
import React from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface AudienceTargetingSectionProps {
  targetAudience: string;
  analysisResult: WebsiteAnalysisResult;
}

const AudienceTargetingSection: React.FC<AudienceTargetingSectionProps> = ({
  targetAudience,
  analysisResult,
}) => {
  // Helper to render keywords safely
  const renderKeywords = (keywords: string[] | string) => {
    if (Array.isArray(keywords)) {
      return keywords.map((keyword, idx) => (
        <span key={idx} className="bg-muted text-xs px-2 py-1 rounded">
          {keyword.trim()}
        </span>
      ));
    } else if (typeof keywords === 'string') {
      return keywords.split(",").map((keyword, idx) => (
        <span key={idx} className="bg-muted text-xs px-2 py-1 rounded">
          {keyword.trim()}
        </span>
      ));
    }
    return null;
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Audience & Targeting</h3>
      <div className="space-y-2">
        <p className="text-sm">{targetAudience}</p>
        {analysisResult.keywords && (
          <div>
            <span className="text-muted-foreground text-sm">Keywords:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {renderKeywords(analysisResult.keywords)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudienceTargetingSection;
