
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface AdCustomizationPanelProps {
  analysisResult: WebsiteAnalysisResult;
  selectedTrigger: string;
}

const AdCustomizationPanel: React.FC<AdCustomizationPanelProps> = ({
  analysisResult,
  selectedTrigger,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md">Customization Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {analysisResult && (
          <>
            <div>
              <h3 className="font-medium mb-1">Business Summary</h3>
              <p className="text-muted-foreground line-clamp-3">
                {analysisResult.businessDescription || "No business description available"}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Target Audience</h3>
              <p className="text-muted-foreground line-clamp-3">
                {analysisResult.targetAudience || "No target audience defined"}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Key Selling Points</h3>
              <ul className="list-disc pl-4 text-muted-foreground">
                {analysisResult.uniqueSellingPoints?.slice(0, 3).map((usp, index) => (
                  <li key={index} className="line-clamp-1">{usp}</li>
                )) || "No selling points identified"}
              </ul>
            </div>
          </>
        )}
        
        {selectedTrigger && (
          <div className="border-t pt-3 mt-3">
            <h3 className="font-medium mb-1">Selected Mind Trigger</h3>
            <p className="text-muted-foreground">{selectedTrigger}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdCustomizationPanel;
