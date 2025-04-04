
import React from "react";
import { AudienceAnalysisResult as AudienceResult } from "@/hooks/useAudienceAnalysis";
import EditableAnalysisText from "./EditableAnalysisText";

interface AudienceAnalysisResultProps {
  analysisResult: AudienceResult;
  onTextChange?: (text: string) => void;
}

const AudienceAnalysisResult: React.FC<AudienceAnalysisResultProps> = ({
  analysisResult,
  onTextChange
}) => {
  // Extract the analysis text from the result
  const analysisText = analysisResult.analysisText || "";

  // Handle text changes if the component is editable
  const handleTextChange = (newText: string) => {
    if (onTextChange) {
      onTextChange(newText);
    }
  };

  return (
    <div className="space-y-4">
      <EditableAnalysisText 
        text={analysisText} 
        onSave={handleTextChange}
      />
    </div>
  );
};

export default AudienceAnalysisResult;
