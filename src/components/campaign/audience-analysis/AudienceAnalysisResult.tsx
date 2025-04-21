
import React from "react";
import { AudienceAnalysisResult as AudienceResult } from "@/hooks/useAudienceAnalysis";
import EditableAnalysisText from "./EditableAnalysisText";

interface AudienceAnalysisResultProps {
  analysisResult: AudienceResult;
  onTextChange?: (text: string) => void;
  platform?: string;
  websiteData?: any;
  isAnalyzing?: boolean;
}

const AudienceAnalysisResult: React.FC<AudienceAnalysisResultProps> = ({
  analysisResult,
  onTextChange,
  platform,
  websiteData,
  isAnalyzing
}) => {
  // Format analysis text as HTML if it contains markdown-like syntax
  const formatAnalysisText = (text: string) => {
    // Replace markdown-like headers with HTML
    let formattedText = text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      
      // Replace bullet points with HTML lists
      .replace(/^\*\s(.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\-\s(.*$)/gim, '<li class="ml-4">$1</li>');
    
    // Add paragraph tags to text that isn't already wrapped in HTML
    const lines = formattedText.split('\n');
    formattedText = lines.map(line => {
      if (line.trim() === '') return '';
      if (line.trim().startsWith('<')) return line;
      return `<p class="mb-2">${line}</p>`;
    }).join('');
    
    // Replace bold text markers with span elements
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>');
    
    return formattedText;
  };

  // Extract the analysis text from the result
  const analysisText = analysisResult.analysisText || "";
  const formattedText = formatAnalysisText(analysisText);

  // Handle text changes if the component is editable
  const handleTextChange = (newText: string) => {
    if (onTextChange) {
      onTextChange(newText);
    }
  };

  return (
    <div className="space-y-4">
      {isAnalyzing ? (
        <div className="p-4 border rounded-md bg-muted animate-pulse">
          <div className="h-6 w-1/3 bg-muted-foreground/20 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-5/6"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-4/6"></div>
          </div>
        </div>
      ) : (
        <EditableAnalysisText 
          text={analysisText} 
          formattedHtml={formattedText}
          onSave={handleTextChange}
        />
      )}
    </div>
  );
};

export default AudienceAnalysisResult;
