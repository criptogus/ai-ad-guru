
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { AudienceAnalysisResult, AudienceCacheInfo } from "@/hooks/useAudienceAnalysis";
import { Loader2, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [platform, setPlatform] = useState(selectedPlatform);
  const { t } = useLanguage();
  
  const handlePlatformChange = (value: string) => {
    setPlatform(value);
    onAnalyze(value === "all" ? undefined : value);
  };

  return (
    <div className="space-y-4">
      <Tabs 
        value={platform} 
        onValueChange={handlePlatformChange}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">{t("All Platforms")}</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="meta">Meta</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          </TabsList>
          
          {cacheInfo?.fromCache && (
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground mr-2">
                {t("Using cached analysis from")} {new Date(cacheInfo.cachedAt || "").toLocaleString()}
              </span>
              <Button 
                size="icon" 
                variant="outline" 
                onClick={() => onAnalyze(platform === "all" ? undefined : platform)}
                disabled={isAnalyzing}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {isAnalyzing ? (
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">{t("Analyzing audience data...")}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {t("This may take a few moments")}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <TabsContent value="all" className="mt-0">
              {analysisResult && renderAnalysisResult(analysisResult)}
            </TabsContent>
            
            <TabsContent value="google" className="mt-0">
              {analysisResult && platform === "google" && renderAnalysisResult(analysisResult)}
            </TabsContent>
            
            <TabsContent value="meta" className="mt-0">
              {analysisResult && platform === "meta" && renderAnalysisResult(analysisResult)}
            </TabsContent>
            
            <TabsContent value="linkedin" className="mt-0">
              {analysisResult && platform === "linkedin" && renderAnalysisResult(analysisResult)}
            </TabsContent>
          </>
        )}
      </Tabs>
      
      {analysisResult && !isAnalyzing && renderAudienceDataBreakdown(analysisResult)}
    </div>
  );
};

// Helper function to render the analysis result
const renderAnalysisResult = (analysisResult: AudienceAnalysisResult) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Audience Analysis</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {analysisResult.analysisText}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to render the audience data breakdown
const renderAudienceDataBreakdown = (analysisData: AudienceAnalysisResult) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Audience Data Breakdown</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Demographics */}
          <div className="space-y-3">
            <h4 className="text-md font-medium">Demographics</h4>
            
            {analysisData.demographics ? (
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Age Groups</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysisData.demographics.ageGroups.map((age, index) => (
                      <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                        {age}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Gender</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysisData.demographics.gender.map((item, index) => (
                      <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Education Level</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysisData.demographics.educationLevel.map((item, index) => (
                      <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Income Level</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysisData.demographics.incomeLevel.map((item, index) => (
                      <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            )}
          </div>
          
          {/* Interests & Pain Points */}
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium mb-2">Interests</h4>
              {analysisData.interests ? (
                <div className="flex flex-wrap gap-1">
                  {analysisData.interests.map((interest, index) => (
                    <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <Skeleton className="h-6 w-full" />
              )}
            </div>
            
            <div>
              <h4 className="text-md font-medium mb-2">Pain Points</h4>
              {analysisData.painPoints ? (
                <div className="flex flex-wrap gap-1">
                  {analysisData.painPoints.map((point, index) => (
                    <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                      {point}
                    </span>
                  ))}
                </div>
              ) : (
                <Skeleton className="h-6 w-full" />
              )}
            </div>
            
            <div>
              <h4 className="text-md font-medium mb-2">Decision Factors</h4>
              {analysisData.decisionFactors ? (
                <div className="flex flex-wrap gap-1">
                  {analysisData.decisionFactors.map((factor, index) => (
                    <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                      {factor}
                    </span>
                  ))}
                </div>
              ) : (
                <Skeleton className="h-6 w-full" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudienceAnalysisPanel;
