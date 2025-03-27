
import React, { useState } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { AudienceAnalysisResult } from "@/hooks/useAudienceAnalysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, BarChart3, Users, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface AudienceAnalysisPanelProps {
  websiteData: WebsiteAnalysisResult;
  isAnalyzing: boolean;
  analysisResult: AudienceAnalysisResult | null;
  onAnalyze: (platform?: string) => Promise<void>;
  selectedPlatform?: string;
}

const AudienceAnalysisPanel: React.FC<AudienceAnalysisPanelProps> = ({
  websiteData,
  isAnalyzing,
  analysisResult,
  onAnalyze,
  selectedPlatform = "all"
}) => {
  const [activePlatform, setActivePlatform] = useState<string>(selectedPlatform);

  const handleSelectPlatform = (platform: string) => {
    setActivePlatform(platform);
    onAnalyze(platform === "all" ? undefined : platform);
  };

  const platformNames = {
    all: "All Platforms",
    google: "Google Ads",
    meta: "Meta/Instagram",
    linkedin: "LinkedIn",
    microsoft: "Microsoft"
  };

  return (
    <div className="space-y-4">
      {!analysisResult ? (
        <div className="bg-muted/50 rounded-lg p-6 text-center space-y-4 border border-border">
          <BarChart3 className="h-12 w-12 mx-auto text-primary/70" />
          <h3 className="text-lg font-medium">Audience Analysis</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Our AI will analyze your website content to identify the ideal target audience for your ads across different platforms.
          </p>
          <div className="flex justify-center pt-2">
            <Button 
              onClick={() => onAnalyze()} 
              disabled={isAnalyzing}
              className="min-w-[200px]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>Analyze Audience</>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Tabs defaultValue={activePlatform} value={activePlatform} onValueChange={handleSelectPlatform}>
            <TabsList className="w-full grid grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="google">Google</TabsTrigger>
              <TabsTrigger value="meta">Instagram</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              <TabsTrigger value="microsoft">Microsoft</TabsTrigger>
            </TabsList>
            
            {Object.entries(platformNames).map(([platform, name]) => (
              <TabsContent key={platform} value={platform} className="pt-4">
                {isAnalyzing ? (
                  <div className="h-60 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground">Analyzing audience for {name}...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-medium flex items-center mb-4">
                          <Users className="mr-2 h-5 w-5 text-primary" />
                          Audience Demographics
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Age Groups</h4>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.demographics.ageGroups.map((age, idx) => (
                                <Badge key={idx} variant="secondary">{age}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Gender</h4>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.demographics.gender.map((g, idx) => (
                                <Badge key={idx} variant="secondary">{g}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Education Level</h4>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.demographics.educationLevel.map((edu, idx) => (
                                <Badge key={idx} variant="secondary">{edu}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Income Level</h4>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.demographics.incomeLevel.map((income, idx) => (
                                <Badge key={idx} variant="secondary">{income}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-medium flex items-center mb-4">
                          <Target className="mr-2 h-5 w-5 text-primary" />
                          Interests & Behaviors
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Interests</h4>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.interests.map((interest, idx) => (
                                <Badge key={idx} variant="secondary">{interest}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Pain Points</h4>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.painPoints.map((pain, idx) => (
                                <Badge key={idx} variant="secondary">{pain}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Decision Factors</h4>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.decisionFactors.map((factor, idx) => (
                                <Badge key={idx} variant="secondary">{factor}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AudienceAnalysisPanel;
