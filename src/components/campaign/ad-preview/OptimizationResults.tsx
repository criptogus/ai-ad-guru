
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Copy, RotateCcw, ThumbsUp, ThumbsDown, CornerUpRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { OptimizedGoogleAd, OptimizedMetaAd } from "@/services/api/optimizerApi";
import { Separator } from "@/components/ui/separator";

interface OptimizationResultsProps {
  adType: "google" | "meta" | "linkedin" | "microsoft";
  originalAds: GoogleAd[] | MetaAd[];
  optimizedAds: OptimizedGoogleAd[] | OptimizedMetaAd[];
  onApplyOptimization: (originalIndex: number, optimizedAd: any) => void;
  onDismiss: () => void;
}

const OptimizationResults: React.FC<OptimizationResultsProps> = ({
  adType,
  originalAds,
  optimizedAds,
  onApplyOptimization,
  onDismiss
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Handle copying text to clipboard
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  
  // Render optimized Google Ads
  const renderGoogleAdOptimizations = (ad: OptimizedGoogleAd, index: number) => {
    const originalAd = originalAds[ad.originalAdIndex] as GoogleAd;
    
    return (
      <Card key={index} className="mb-4 border-blue-100 dark:border-blue-800">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Optimization #{index + 1}</CardTitle>
            <Badge variant="outline" className="text-xs">
              For Ad #{ad.originalAdIndex + 1}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Optimized Headlines</h4>
            <div className="space-y-2">
              {ad.headlines.map((headline, i) => (
                <div 
                  key={i} 
                  className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm group"
                >
                  <span>{headline}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopy(headline, (index * 10) + i)}
                  >
                    {copiedIndex === (index * 10) + i ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Optimized Descriptions</h4>
            <div className="space-y-2">
              {ad.descriptions.map((description, i) => (
                <div 
                  key={i} 
                  className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm group"
                >
                  <span className="line-clamp-1">{description}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopy(description, (index * 100) + (i + 50))}
                  >
                    {copiedIndex === (index * 100) + (i + 50) ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-1">Optimization Rationale</h4>
            <p className="text-xs text-muted-foreground">{ad.rationale}</p>
          </div>
          
          <div className="pt-2 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onApplyOptimization(ad.originalAdIndex, ad)}
            >
              <CornerUpRight className="h-3.5 w-3.5 mr-1" />
              Apply Changes
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <ThumbsUp className="h-3.5 w-3.5 text-green-500" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <ThumbsDown className="h-3.5 w-3.5 text-red-500" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Render optimized Meta/LinkedIn Ads
  const renderMetaAdOptimizations = (ad: OptimizedMetaAd, index: number) => {
    const originalAd = originalAds[ad.originalAdIndex] as MetaAd;
    
    return (
      <Card key={index} className="mb-4 border-blue-100 dark:border-blue-800">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Optimization #{index + 1}</CardTitle>
            <Badge variant="outline" className="text-xs">
              For Ad #{ad.originalAdIndex + 1}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Optimized Primary Text</h4>
            <div className="space-y-2">
              {ad.primaryText.map((text, i) => (
                <div 
                  key={i} 
                  className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm group"
                >
                  <span className="line-clamp-1">{text}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopy(text, (index * 10) + i)}
                  >
                    {copiedIndex === (index * 10) + i ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Optimized Headlines</h4>
            <div className="space-y-2">
              {ad.headline.map((headline, i) => (
                <div 
                  key={i} 
                  className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm group"
                >
                  <span>{headline}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopy(headline, (index * 100) + (i + 20))}
                  >
                    {copiedIndex === (index * 100) + (i + 20) ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Optimized Descriptions</h4>
            <div className="space-y-2">
              {ad.description.map((description, i) => (
                <div 
                  key={i} 
                  className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm group"
                >
                  <span className="line-clamp-1">{description}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopy(description, (index * 100) + (i + 40))}
                  >
                    {copiedIndex === (index * 100) + (i + 40) ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {ad.imagePrompt && (
            <div>
              <h4 className="text-sm font-medium mb-2">Optimized Image Prompt</h4>
              <div 
                className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm group"
              >
                <span className="line-clamp-1">{ad.imagePrompt}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleCopy(ad.imagePrompt!, (index * 100) + 60)}
                >
                  {copiedIndex === (index * 100) + 60 ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-1">Optimization Rationale</h4>
            <p className="text-xs text-muted-foreground">{ad.rationale}</p>
          </div>
          
          <div className="pt-2 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onApplyOptimization(ad.originalAdIndex, ad)}
            >
              <CornerUpRight className="h-3.5 w-3.5 mr-1" />
              Apply Changes
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <ThumbsUp className="h-3.5 w-3.5 text-green-500" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <ThumbsDown className="h-3.5 w-3.5 text-red-500" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">
            AI Optimization Results
          </CardTitle>
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {optimizedAds.length} optimization{optimizedAds.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[500px] pr-4">
          {adType === "google" && optimizedAds.map((ad, index) => 
            renderGoogleAdOptimizations(ad as OptimizedGoogleAd, index)
          )}
          
          {(adType === "meta" || adType === "linkedin") && optimizedAds.map((ad, index) => 
            renderMetaAdOptimizations(ad as OptimizedMetaAd, index)
          )}
        </ScrollArea>
        
        <Separator className="my-4" />
        
        <div className="flex justify-end">
          <Button variant="ghost" onClick={onDismiss}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Close Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizationResults;
