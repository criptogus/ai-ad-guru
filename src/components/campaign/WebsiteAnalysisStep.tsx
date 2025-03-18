
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
    <Card>
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
            <div className="mt-6 space-y-4 bg-green-50 p-4 rounded-md border border-green-200">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle size={20} />
                <h3 className="font-medium">Analysis Complete</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Company Name</p>
                  <p>{analysisResult.companyName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Brand Tone</p>
                  <p>{analysisResult.brandTone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Business Description</p>
                  <p>{analysisResult.businessDescription}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Target Audience</p>
                  <p>{analysisResult.targetAudience}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Keywords</p>
                  <ul className="list-disc list-inside text-sm">
                    {analysisResult.keywords.map((keyword, index) => (
                      <li key={index}>{keyword}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Call to Action</p>
                  <ul className="list-disc list-inside text-sm">
                    {analysisResult.callToAction.map((cta, index) => (
                      <li key={index}>{cta}</li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Unique Selling Points</p>
                  <ul className="list-disc list-inside text-sm">
                    {analysisResult.uniqueSellingPoints.map((usp, index) => (
                      <li key={index}>{usp}</li>
                    ))}
                  </ul>
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
