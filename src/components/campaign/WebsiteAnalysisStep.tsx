
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WebsiteAnalysisResult, AnalysisCache } from "@/hooks/useWebsiteAnalysis";
import WebsiteUrlInput from "./website-analysis/WebsiteUrlInput";
import AnalysisInfoBox from "./website-analysis/AnalysisInfoBox";
import AnalysisResults from "./website-analysis/AnalysisResults";
import { Badge } from "@/components/ui/badge";
import { Calendar, Globe } from "lucide-react";
import { format } from "date-fns";

interface WebsiteAnalysisStepProps {
  isAnalyzing: boolean;
  analysisResult: WebsiteAnalysisResult | null;
  onAnalyzeWebsite: (url: string) => Promise<WebsiteAnalysisResult | null>;
  onNext: () => void;
  cacheInfo?: AnalysisCache | null;
}

const WebsiteAnalysisStep: React.FC<WebsiteAnalysisStepProps> = ({
  isAnalyzing,
  analysisResult,
  onAnalyzeWebsite,
  onNext,
  cacheInfo
}) => {
  const [website, setWebsite] = useState("");
  const [progress, setProgress] = useState(0);
  const [editedResult, setEditedResult] = useState<WebsiteAnalysisResult | null>(null);

  // Initialize edited result when analysis result changes
  useEffect(() => {
    if (analysisResult && !editedResult) {
      setEditedResult({ ...analysisResult });
      console.log("Initialized edited result from analysis result:", analysisResult);
    }
  }, [analysisResult, editedResult]);

  // Simulate progress when analyzing
  useEffect(() => {
    if (isAnalyzing) {
      console.log("Analysis in progress, updating progress bar");
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
    console.log("Analyzing website:", website);
    
    // Call the analyze function with the user-entered URL
    const result = await onAnalyzeWebsite(website);
    
    console.log("Analysis result:", result);
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
    
    const newArray = [...(editedResult[field] as string[])];
    newArray[index] = value;
    
    setEditedResult({
      ...editedResult,
      [field]: newArray,
    });
  };

  const handleNext = () => {
    // Pass the edited result back through context or props
    if (editedResult) {
      console.log("Moving to next step with edited result:", editedResult);
      onNext();
    }
  };

  const formatCacheDate = (dateString?: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  // Language display
  const getLanguageName = (code?: string) => {
    if (!code) return "Unknown";
    
    const languages: Record<string, string> = {
      en: "English",
      pt: "Portuguese",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      "pt-br": "Brazilian Portuguese",
      "en-us": "American English",
      "es-es": "Spanish (Spain)"
    };
    
    return languages[code.toLowerCase()] || code;
  };

  return (
    <Card className="shadow-md border border-accent/20 overflow-hidden">
      <CardHeader className="bg-card pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-foreground">Website Analysis</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your website URL so our AI can analyze it and suggest campaign settings
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            {analysisResult?.language && (
              <Badge variant="outline" className="flex items-center gap-1 bg-blue-100/10">
                <Globe className="h-3 w-3" />
                <span className="text-xs">{getLanguageName(analysisResult.language)}</span>
              </Badge>
            )}
            
            {cacheInfo?.fromCache && cacheInfo.cachedAt && (
              <Badge variant="outline" className="flex items-center gap-1 bg-amber-100/10">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">Cached {formatCacheDate(cacheInfo.cachedAt)}</span>
              </Badge>
            )}
          </div>
        </div>
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
              cacheInfo={cacheInfo}
            />
          )}

          {!analysisResult && !isAnalyzing && <AnalysisInfoBox />}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteAnalysisStep;
