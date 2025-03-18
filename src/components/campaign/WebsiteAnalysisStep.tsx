
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Globe, CheckCircle } from "lucide-react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

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

  // Simulate progress when analyzing
  React.useEffect(() => {
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
    await onAnalyzeWebsite(website);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Website Analysis</CardTitle>
        <CardDescription>
          Enter your website URL so our AI can analyze it and suggest campaign settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="website"
                  placeholder="https://example.com"
                  className="pl-10"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  disabled={isAnalyzing || !!analysisResult}
                />
              </div>
              {!analysisResult ? (
                <Button 
                  onClick={handleAnalyzeClick} 
                  disabled={isAnalyzing || !website}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze"}
                </Button>
              ) : (
                <Button
                  onClick={onNext}
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Next Step
                </Button>
              )}
            </div>
          </div>

          {(isAnalyzing || analysisResult) && (
            <Progress value={progress} className="w-full h-2" />
          )}

          {analysisResult && (
            <div className="mt-6 space-y-6 rounded-lg border border-green-200 bg-green-50 p-6">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle size={20} />
                <h3 className="font-medium text-lg">Analysis Complete</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-2">Company Information</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Company Name</p>
                      <p className="font-medium">{analysisResult.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Business Description</p>
                      <p>{analysisResult.businessDescription}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Brand Tone</p>
                      <p>{analysisResult.brandTone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-2">Target Audience</h4>
                  <p>{analysisResult.targetAudience}</p>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywords.map((keyword, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-2">Call to Action Suggestions</h4>
                  <ul className="space-y-2">
                    {analysisResult.callToAction.map((cta, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-green-100 text-green-800 w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs">
                          {index + 1}
                        </span>
                        <span>{cta}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm md:col-span-2">
                  <h4 className="font-medium text-gray-700 mb-2">Unique Selling Points</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {analysisResult.uniqueSellingPoints.map((usp, index) => (
                      <div key={index} className="bg-purple-50 border border-purple-100 p-3 rounded-md">
                        <span className="text-purple-800 font-medium block mb-1">USP {index + 1}</span>
                        <p className="text-sm">{usp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!analysisResult && !isAnalyzing && (
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">How it works:</h3>
              <p className="text-sm text-muted-foreground">
                Our AI will analyze your website to extract key information such as:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Business description and industry</li>
                <li>• Target audience demographics</li>
                <li>• Key selling points and value propositions</li>
                <li>• Brand tone and messaging style</li>
                <li>• Suggested keywords and call-to-actions</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteAnalysisStep;
