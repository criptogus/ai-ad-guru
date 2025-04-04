
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { AudienceAnalysisResult, AudienceCacheInfo } from "@/hooks/useAudienceAnalysis";
import AudienceAnalysisResult from "./AudienceAnalysisResult";
import AudienceDataBreakdown from "./AudienceDataBreakdown";
import { Loader2, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
              {analysisResult && <AudienceAnalysisResult analysisResult={analysisResult} />}
            </TabsContent>
            
            <TabsContent value="google" className="mt-0">
              {analysisResult && platform === "google" && <AudienceAnalysisResult analysisResult={analysisResult} />}
            </TabsContent>
            
            <TabsContent value="meta" className="mt-0">
              {analysisResult && platform === "meta" && <AudienceAnalysisResult analysisResult={analysisResult} />}
            </TabsContent>
            
            <TabsContent value="linkedin" className="mt-0">
              {analysisResult && platform === "linkedin" && <AudienceAnalysisResult analysisResult={analysisResult} />}
            </TabsContent>
          </>
        )}
      </Tabs>
      
      {analysisResult && !isAnalyzing && (
        <AudienceDataBreakdown analysisData={analysisResult} />
      )}
    </div>
  );
};

export default AudienceAnalysisPanel;
