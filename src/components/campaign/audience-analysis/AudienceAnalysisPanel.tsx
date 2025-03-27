
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Lightbulb, Target, PieChart, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AudienceAnalysisResult } from "@/hooks/useAudienceAnalysis";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface AudienceAnalysisPanelProps {
  websiteData: WebsiteAnalysisResult;
  isAnalyzing: boolean;
  analysisResult: AudienceAnalysisResult | null;
  onAnalyze: (platform?: string) => Promise<void>;
  selectedPlatform?: string; // Add this prop to the interface
}

const AudienceAnalysisPanel: React.FC<AudienceAnalysisPanelProps> = ({
  websiteData,
  isAnalyzing,
  analysisResult,
  onAnalyze,
  selectedPlatform = "all" // Provide a default value
}) => {
  const [internalSelectedPlatform, setInternalSelectedPlatform] = useState<string>(selectedPlatform);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    const platform = internalSelectedPlatform === "all" ? undefined : internalSelectedPlatform;
    await onAnalyze(platform);
  };

  const handleCopyToClipboard = () => {
    if (analysisResult?.analysisText) {
      navigator.clipboard.writeText(analysisResult.analysisText);
      toast({
        title: "Copied",
        description: "Analysis copied to clipboard",
      });
    }
  };

  // Function to process the text and add basic formatting
  const formatAnalysisText = (text: string) => {
    // Replace line breaks with <br> elements
    let formattedText = text.replace(/\n/g, '<br />');
    
    // Add bold to headings (lines ending with : or that are all uppercase)
    formattedText = formattedText.replace(/([A-Za-z\s]+)(:)(<br \/>)/g, '<strong>$1$2</strong>$3');
    formattedText = formattedText.replace(/(<br \/>)([A-Z][A-Z\s]+)(<br \/>)/g, '$1<strong>$2</strong>$3');
    
    // Add styling to bullet points
    formattedText = formattedText.replace(/- (.*?)(<br \/>)/g, '• <span class="ml-2">$1</span>$2');
    
    return formattedText;
  };

  return (
    <Card className="shadow-md border border-accent/20">
      <CardHeader className="bg-card pb-4">
        <CardTitle className="text-xl text-foreground flex items-center">
          <Target className="mr-2 h-5 w-5 text-primary" />
          Advanced Audience Analysis
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Generate detailed targeting recommendations based on your website content
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium mb-1">Select Platform:</h3>
              <Tabs 
                value={internalSelectedPlatform} 
                onValueChange={setInternalSelectedPlatform} 
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="all">All Platforms</TabsTrigger>
                  <TabsTrigger value="google">Google Ads</TabsTrigger>
                  <TabsTrigger value="meta">Meta Ads</TabsTrigger>
                  <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !websiteData}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Generate Targeting
                </>
              )}
            </Button>
          </div>
          
          {!websiteData && (
            <div className="p-4 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 rounded-md">
              Please complete website analysis first to use this feature.
            </div>
          )}
          
          {analysisResult && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-purple-600" />
                  <h3 className="font-medium">Analysis Results</h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    {analysisResult.platform === 'all' ? 'All Platforms' : `${analysisResult.platform} Ads`}
                  </Badge>
                  
                  <Button size="sm" variant="outline" onClick={handleCopyToClipboard}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              <Card className="border border-accent/20">
                <CardContent className="p-4">
                  <ScrollArea className="h-[400px] pr-4">
                    {analysisResult.analysisText ? (
                      <div 
                        className="text-sm leading-relaxed whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: formatAnalysisText(analysisResult.analysisText) }}
                      />
                    ) : (
                      <p className="text-muted-foreground italic">No analysis data available</p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudienceAnalysisPanel;
