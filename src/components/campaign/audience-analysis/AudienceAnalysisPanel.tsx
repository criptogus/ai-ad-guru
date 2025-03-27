
import React from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { AudienceAnalysisResult, AudienceCacheInfo } from "@/hooks/useAudienceAnalysis";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useFormContext, Controller } from "react-hook-form";

interface AudienceAnalysisPanelProps {
  websiteData: WebsiteAnalysisResult;
  isAnalyzing: boolean;
  analysisResult: AudienceAnalysisResult | null;
  onAnalyze: (platform?: string) => Promise<void>;
  selectedPlatform?: string;
  cacheInfo: AudienceCacheInfo | null;
}

const AudienceAnalysisPanel: React.FC<AudienceAnalysisPanelProps> = ({
  websiteData,
  isAnalyzing,
  analysisResult,
  onAnalyze,
  selectedPlatform = "all",
  cacheInfo
}) => {
  const { control } = useFormContext();

  const formatCacheDate = (dateString?: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  if (!websiteData) {
    return <div>Website data is required for audience analysis</div>;
  }

  return (
    <div className="space-y-4">
      <Tabs value={selectedPlatform} onValueChange={(value) => onAnalyze(value === "all" ? undefined : value)} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="all">All Platforms</TabsTrigger>
          <TabsTrigger value="google">Google</TabsTrigger>
          <TabsTrigger value="meta">Meta</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPlatform}>
          <Card>
            <CardContent className="pt-6">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p>Analyzing audience for {selectedPlatform === "all" ? "all platforms" : selectedPlatform}...</p>
                </div>
              ) : analysisResult ? (
                <div className="space-y-6">
                  {cacheInfo?.fromCache && cacheInfo.cachedAt && (
                    <div className="bg-muted/30 p-3 rounded-md flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Using cached analysis</span> from {formatCacheDate(cacheInfo.cachedAt)}
                      </div>
                      <Button size="sm" variant="outline" onClick={() => onAnalyze(selectedPlatform === "all" ? undefined : selectedPlatform)}>
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium text-lg mb-3">Audience Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Controller
                        name="demographics"
                        control={control}
                        defaultValue={analysisResult.demographics || {}}
                        render={({ field }) => (
                          <div className="bg-muted/20 p-4 rounded-md">
                            <h4 className="font-medium mb-2">Demographics</h4>
                            <ul className="space-y-1 text-sm">
                              <li><span className="font-medium">Age:</span> {analysisResult.demographics?.ageGroups.join(", ")}</li>
                              <li><span className="font-medium">Gender:</span> {analysisResult.demographics?.gender.join(", ")}</li>
                              <li><span className="font-medium">Education:</span> {analysisResult.demographics?.educationLevel.join(", ")}</li>
                              <li><span className="font-medium">Income:</span> {analysisResult.demographics?.incomeLevel.join(", ")}</li>
                            </ul>
                          </div>
                        )}
                      />

                      <div className="bg-muted/20 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Interests</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.interests?.map((interest, index) => (
                            <Badge key={index} variant="secondary">{interest}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-3">Decision Factors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted/20 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Pain Points</h4>
                        <ul className="space-y-1 text-sm list-disc pl-5">
                          {analysisResult.painPoints?.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-muted/20 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Decision Drivers</h4>
                        <ul className="space-y-1 text-sm list-disc pl-5">
                          {analysisResult.decisionFactors?.map((factor, index) => (
                            <li key={index}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/20 p-4 rounded-md">
                    <h3 className="font-medium text-lg mb-2">Detailed Analysis</h3>
                    <p className="text-sm whitespace-pre-line">{analysisResult.analysisText}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="mb-4">No audience analysis performed yet</p>
                  <Button onClick={() => onAnalyze(selectedPlatform === "all" ? undefined : selectedPlatform)}>
                    Analyze Audience
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AudienceAnalysisPanel;
