
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import WebsiteUrlInput from "./website-analysis/WebsiteUrlInput";
import AnalysisInfoBox from "./website-analysis/AnalysisInfoBox";
import AnalysisResults from "./website-analysis/AnalysisResults";

interface WebsiteAnalysisStepProps {
  isAnalyzing: boolean;
  analysisResult: WebsiteAnalysisResult | null;
  onAnalyzeWebsite: (url: string) => Promise<WebsiteAnalysisResult | null>;
  onNext: () => void;
}

const WebsiteAnalysisStep: React.FC<WebsiteAnalysisStepProps> = ({
  isAnalyzing,
  analysisResult,
  onAnalyzeWebsite,
  onNext,
}) => {
  const [website, setWebsite] = useState("");
  const [progress, setProgress] = useState(0);
  const [editedResult, setEditedResult] = useState<WebsiteAnalysisResult | null>(null);

  // Initialize edited result when analysis result changes
  useEffect(() => {
    if (analysisResult && !editedResult) {
      setEditedResult({ ...analysisResult });
    }
  }, [analysisResult, editedResult]);

  // Simulate progress when analyzing
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setProgress(analysisResult ? 100 : 0);
    }
  }, [isAnalyzing, analysisResult]);

  const handleAnalyzeClick = async () => {
    setProgress(10);
    const result = await onAnalyzeWebsite(website);
    if (result) {
      setEditedResult({ ...result });
    }
  };

  const handleTextChange = (field: keyof WebsiteAnalysisResult, value: string) => {
    if (!editedResult) return;
    
    setEditedResult({
      ...editedResult,
      [field]: value,
    });
  };

  const handleArrayItemChange = (
    field: 'keywords' | 'callToAction' | 'uniqueSellingPoints', 
    index: number, 
    value: string
  ) => {
    if (!editedResult) return;
    
    const newArray = [...editedResult[field]];
    newArray[index] = value;
    
    setEditedResult({
      ...editedResult,
      [field]: newArray,
    });
  };

  const handleNext = () => {
    // Pass the edited result back through context or props
    if (editedResult) {
      onNext();
    }
  };

  return (
    <Card className="shadow-md border border-accent/20 overflow-hidden">
      <CardHeader className="bg-card pb-4">
        <CardTitle className="text-xl text-foreground">Website Analysis</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your website URL so our AI can analyze it and suggest campaign settings
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <WebsiteUrlInput
            website={website}
            setWebsite={setWebsite}
            onAnalyze={handleAnalyzeClick}
            isAnalyzing={isAnalyzing}
          />

          {(isAnalyzing || analysisResult) && (
            <div className="my-4">
              <Progress value={progress} className="w-full h-2" />
              {isAnalyzing && (
                <p className="text-xs text-muted-foreground mt-1 text-right">{progress}%</p>
              )}
            </div>
          )}

          {analysisResult && editedResult && (
            <AnalysisResults
              analysisResult={editedResult}
              onTextChange={handleTextChange}
              onArrayItemChange={handleArrayItemChange}
              onNext={handleNext}
            />
          )}

          {!analysisResult && !isAnalyzing && <AnalysisInfoBox />}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteAnalysisStep;
