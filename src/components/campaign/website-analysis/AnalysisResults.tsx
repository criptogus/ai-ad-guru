
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Card, CardContent } from "@/components/ui/card";

interface AnalysisResultsProps {
  analysisResult: WebsiteAnalysisResult;
  onTextChange: (field: keyof WebsiteAnalysisResult, value: string) => void;
  onArrayItemChange: (field: "keywords" | "callToAction" | "uniqueSellingPoints", index: number, value: string) => void;
  onNext: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysisResult,
  onTextChange,
  onArrayItemChange,
  onNext,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardContent className="p-4 space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={analysisResult.companyName}
                onChange={(e) => onTextChange("companyName", e.target.value)}
                className="bg-background border-input"
              />
            </div>

            <div>
              <Label htmlFor="brandTone">Brand Tone</Label>
              <Input
                id="brandTone"
                value={analysisResult.brandTone}
                onChange={(e) => onTextChange("brandTone", e.target.value)}
                className="bg-background border-input"
              />
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                value={analysisResult.targetAudience}
                onChange={(e) => onTextChange("targetAudience", e.target.value)}
                className="bg-background border-input"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="businessDescription">Business Description</Label>
              <Textarea
                id="businessDescription"
                value={analysisResult.businessDescription}
                onChange={(e) => onTextChange("businessDescription", e.target.value)}
                className="bg-background border-input"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 space-y-4">
            <div>
              <Label>Keywords</Label>
              <div className="space-y-2 mt-2">
                {analysisResult.keywords.map((keyword, index) => (
                  <div key={`keyword-${index}`} className="flex items-center gap-2">
                    <Input
                      value={keyword}
                      onChange={(e) => onArrayItemChange("keywords", index, e.target.value)}
                      className="bg-background border-input"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Unique Selling Points</Label>
              <div className="space-y-2 mt-2">
                {analysisResult.uniqueSellingPoints.map((usp, index) => (
                  <div key={`usp-${index}`} className="flex items-center gap-2">
                    <Input
                      value={usp}
                      onChange={(e) => onArrayItemChange("uniqueSellingPoints", index, e.target.value)}
                      className="bg-background border-input"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Call To Action</Label>
              <div className="space-y-2 mt-2">
                {analysisResult.callToAction.map((cta, index) => (
                  <div key={`cta-${index}`} className="flex items-center gap-2">
                    <Input
                      value={cta}
                      onChange={(e) => onArrayItemChange("callToAction", index, e.target.value)}
                      className="bg-background border-input"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} className="mt-4">
          Continue to Next Step
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResults;
