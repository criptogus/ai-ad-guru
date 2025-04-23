
import React from "react";
import { Button } from "@/components/ui/button";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { AudienceAnalysisResult, AudienceCacheInfo } from "@/hooks/useAudienceAnalysis";
import AudienceAnalysisResult from "./AudienceAnalysisResult";
import { Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AudienceAnalysisPanelProps {
  websiteData: WebsiteAnalysisResult;
  isAnalyzing: boolean;
  analysisResult: AudienceAnalysisResult | null;
  onAnalyze: (platform?: string) => Promise<void>;
  selectedPlatform?: string;
  cacheInfo?: AudienceCacheInfo | null;
}

const AudienceAnalysisPanel: React.FC<AudienceAnalysisPanelProps> = ({
  websiteData,
  isAnalyzing,
  analysisResult,
  onAnalyze,
  selectedPlatform = "all",
  cacheInfo
}) => {
  const formatCacheDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  const handlePlatformChange = (platform: string) => {
    onAnalyze(platform);
  };

  const handleRefreshAnalysis = () => {
    onAnalyze(selectedPlatform);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Platform Focus:</span>
          <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="google">Google Ads</SelectItem>
              <SelectItem value="meta">Meta Ads</SelectItem>
              <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
              <SelectItem value="microsoft">Microsoft Ads</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          disabled={isAnalyzing}
          onClick={handleRefreshAnalysis}
          className="shrink-0"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Analysis
            </>
          )}
        </Button>
      </div>

      {cacheInfo?.fromCache && cacheInfo.cachedAt && (
        <div className="bg-muted p-3 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Cached</Badge>
            <span className="text-sm text-muted-foreground">
              Analysis from {formatCacheDate(cacheInfo.cachedAt)}
            </span>
          </div>
        </div>
      )}

      {isAnalyzing ? (
        <Card>
          <CardContent className="pt-6">
            <AudienceAnalysisResult 
              analysisResult={{ analysisText: "", success: false }} 
              isAnalyzing={true}
            />
          </CardContent>
        </Card>
      ) : analysisResult ? (
        <Card>
          <CardContent className="pt-6">
            <AudienceAnalysisResult 
              analysisResult={analysisResult} 
              websiteData={websiteData}
              platform={selectedPlatform}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">No audience analysis available yet</p>
            <Button 
              onClick={() => onAnalyze(selectedPlatform)}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Audience"
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AudienceAnalysisPanel;
