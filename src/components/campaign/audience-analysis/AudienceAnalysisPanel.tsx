
import React, { useState } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { AudienceAnalysisResult, AudienceCacheInfo } from "@/hooks/useAudienceAnalysis";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw, BarChart3, Calendar } from "lucide-react";
import AudienceAnalysisResultComponent from "./AudienceAnalysisResult";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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
  const [platform, setPlatform] = useState(selectedPlatform);
  
  const handlePlatformChange = (value: string) => {
    setPlatform(value);
    onAnalyze(value === "all" ? undefined : value);
  };
  
  const handleAnalyzeClick = () => {
    onAnalyze(platform === "all" ? undefined : platform);
  };
  
  const formatCacheDate = (dateString?: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };
  
  // Calculate days remaining in cache if fromCache is true
  const getDaysRemaining = () => {
    if (!cacheInfo?.fromCache || !cacheInfo.expiresAt) return null;
    
    const today = new Date();
    const expiresAt = new Date(cacheInfo.expiresAt);
    const diffTime = expiresAt.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  const daysRemaining = getDaysRemaining();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Audience Analysis</h3>
            
            {cacheInfo?.fromCache && cacheInfo.cachedAt && (
              <Badge variant="outline" className="flex items-center gap-1 bg-amber-100/10">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">
                  Cached {formatCacheDate(cacheInfo.cachedAt)}
                  {daysRemaining !== null && ` · ${daysRemaining} days remaining`}
                </span>
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {cacheInfo?.fromCache 
              ? "Using cached audience analysis. Results are valid for 30 days."
              : "Let our AI analyze your target audience based on your website content"}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={platform} onValueChange={handlePlatformChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="google">Google Ads</SelectItem>
              <SelectItem value="meta">Instagram Ads</SelectItem>
              <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
              <SelectItem value="microsoft">Microsoft Ads</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant={analysisResult ? "outline" : "default"}
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : analysisResult ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Analysis
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-4 w-4" />
                Analyze Audience
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isAnalyzing && !analysisResult && (
        <Card>
          <CardContent className="py-10 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-center text-muted-foreground">
              Analyzing {platform === "all" ? "audience across all platforms" : `${platform} audience`}...
            </p>
          </CardContent>
        </Card>
      )}
      
      {!isAnalyzing && !analysisResult && (
        <Card>
          <CardContent className="py-10 flex flex-col items-center justify-center">
            <p className="text-center text-muted-foreground mb-4">
              Click "Analyze Audience" to generate audience targeting recommendations
            </p>
            <Button onClick={handleAnalyzeClick}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Analyze Audience
            </Button>
          </CardContent>
        </Card>
      )}
      
      {analysisResult && (
        <AudienceAnalysisResultComponent
          analysisResult={analysisResult}
          onTextChange={undefined}
        />
      )}
    </div>
  );
};

export default AudienceAnalysisPanel;
