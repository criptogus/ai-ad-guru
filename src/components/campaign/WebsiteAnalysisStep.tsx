
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Globe, CheckCircle, ArrowRight } from "lucide-react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Textarea } from "@/components/ui/textarea";

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
  React.useEffect(() => {
    if (analysisResult && !editedResult) {
      setEditedResult({ ...analysisResult });
    }
  }, [analysisResult, editedResult]);

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
    if (editedResult && onNext) {
      // Update the analysis result with edited values
      onAnalyzeWebsite(website).then(() => {
        onNext();
      });
    }
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
                  disabled={isAnalyzing}
                />
              </div>
              <Button 
                onClick={handleAnalyzeClick} 
                disabled={isAnalyzing || !website}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          </div>

          {(isAnalyzing || analysisResult) && (
            <Progress value={progress} className="w-full h-2" />
          )}

          {analysisResult && editedResult && (
            <div className="mt-6 space-y-6 rounded-lg border border-green-200 bg-green-50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle size={20} />
                  <h3 className="font-medium text-lg">Analysis Complete</h3>
                </div>
                <Button 
                  onClick={handleNext}
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  Next Step
                  <ArrowRight size={16} />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-2">Company Information</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName" className="text-sm font-medium text-gray-500">Company Name</Label>
                      <Input
                        id="companyName"
                        value={editedResult.companyName}
                        onChange={(e) => handleTextChange('companyName', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessDescription" className="text-sm font-medium text-gray-500">Business Description</Label>
                      <Textarea
                        id="businessDescription"
                        value={editedResult.businessDescription}
                        onChange={(e) => handleTextChange('businessDescription', e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="brandTone" className="text-sm font-medium text-gray-500">Brand Tone</Label>
                      <Input
                        id="brandTone"
                        value={editedResult.brandTone}
                        onChange={(e) => handleTextChange('brandTone', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-2">Target Audience</h4>
                  <Textarea
                    value={editedResult.targetAudience}
                    onChange={(e) => handleTextChange('targetAudience', e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-2">Keywords</h4>
                  <div className="space-y-2">
                    {editedResult.keywords.map((keyword, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        <Input
                          value={keyword}
                          onChange={(e) => handleArrayItemChange('keywords', index, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-2">Call to Action Suggestions</h4>
                  <div className="space-y-2">
                    {editedResult.callToAction.map((cta, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        <Input
                          value={cta}
                          onChange={(e) => handleArrayItemChange('callToAction', index, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm md:col-span-2">
                  <h4 className="font-medium text-gray-700 mb-2">Unique Selling Points</h4>
                  <div className="space-y-3 mt-2">
                    {editedResult.uniqueSellingPoints.map((usp, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="bg-purple-100 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center mt-1 text-xs">
                          {index + 1}
                        </span>
                        <Textarea
                          value={usp}
                          onChange={(e) => handleArrayItemChange('uniqueSellingPoints', index, e.target.value)}
                          className="flex-1"
                          rows={2}
                        />
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
