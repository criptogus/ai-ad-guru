
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Sparkles } from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MetaAdCard } from "./card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

interface MetaAdsTabProps {
  metaAds: MetaAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateAds: () => Promise<void>;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateMetaAd: (index: number, updatedAd: MetaAd) => void;
  mindTrigger?: string;
}

const MetaAdsTab: React.FC<MetaAdsTabProps> = ({
  metaAds,
  analysisResult,
  isGenerating,
  loadingImageIndex,
  onGenerateAds,
  onGenerateImage,
  onUpdateMetaAd,
  mindTrigger,
}) => {
  const [editingAdIndex, setEditingAdIndex] = useState<number | null>(null);
  const [localAds, setLocalAds] = useState<MetaAd[]>(metaAds);

  useEffect(() => {
    setLocalAds(metaAds);
  }, [metaAds]);

  const handleEditAd = (index: number) => {
    setEditingAdIndex(index);
  };

  const handleSaveAd = (index: number, updatedAd: MetaAd) => {
    const newAds = [...localAds];
    newAds[index] = updatedAd;
    setLocalAds(newAds);
    onUpdateMetaAd(index, updatedAd);
    setEditingAdIndex(null);
    toast.success("Ad updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingAdIndex(null);
    setLocalAds(metaAds);
  };

  const handleCopyAd = (ad: MetaAd) => {
    const text = `Headline: ${ad.headline}\n\nPrimary Text: ${ad.primaryText}\n\nDescription: ${ad.description}`;
    navigator.clipboard.writeText(text);
    toast.success("Ad content copied to clipboard");
  };

  const handleGenerateImage = async (ad: MetaAd, index: number): Promise<void> => {
    try {
      await onGenerateImage(ad, index);
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  };
  
  // Format mind trigger display with better formatting
  const formatMindTrigger = (trigger: string) => {
    if (!trigger) return "";
    
    // Handle custom triggers (prefixed with "custom:")
    if (trigger.startsWith("custom:")) {
      // Return just the first line of the custom trigger for display
      const content = trigger.substring(7);
      const firstLine = content.split('\n')[0];
      return firstLine.length > 100 ? firstLine.substring(0, 100) + "..." : firstLine;
    }
    
    // Format trigger_id to readable format
    const triggerMap: Record<string, string> = {
      // Meta/Instagram triggers
      "lifestyle": "Lifestyle Aspiration",
      "before_after": "Before & After",
      "user_generated": "User Generated Content",
      "storytelling": "Storytelling",
      "tutorial": "Tutorial/How-to",
      
      // Google/Microsoft triggers
      "urgency": "Urgency",
      "social_proof": "Social Proof",
      "problem_solution": "Problem-Solution",
      "curiosity": "Curiosity",
      "comparison": "Comparison",
      
      // LinkedIn triggers
      "thought_leadership": "Thought Leadership",
      "data_insights": "Data & Insights",
      "professional_growth": "Professional Growth",
      "industry_trends": "Industry Trends",
      "case_study": "Case Study"
    };
    
    return triggerMap[trigger] || 
      trigger.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  };

  return (
    <div className="space-y-4">
      {mindTrigger && (
        <Alert className="mb-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <AlertTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Active Mind Trigger
          </AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-300">
            <span className="font-medium">{formatMindTrigger(mindTrigger)}</span>
          </AlertDescription>
        </Alert>
      )}
      
      {metaAds.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4 py-6">
              <h3 className="text-lg font-medium">No Instagram Ads Created Yet</h3>
              <p className="text-muted-foreground">
                Generate Instagram ads based on your website analysis.
              </p>
              <Button 
                onClick={onGenerateAds} 
                disabled={isGenerating}
                className="mt-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Ads...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Generate Instagram Ads
                  </>
                )}
              </Button>
              <div className="text-xs text-muted-foreground mt-2">
                This will use 5 credits
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Instagram Ad Variations</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateAds}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                "Regenerate Ads"
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {localAds.map((ad, index) => (
              <MetaAdCard
                key={index}
                index={index}
                ad={ad}
                analysisResult={analysisResult}
                isEditing={editingAdIndex === index}
                isGeneratingImage={loadingImageIndex === index}
                loadingImageIndex={loadingImageIndex}
                onEdit={() => handleEditAd(index)}
                onSave={(updatedAd) => handleSaveAd(index, updatedAd)}
                onCancel={handleCancelEdit}
                onCopy={() => handleCopyAd(ad)}
                onGenerateImage={() => handleGenerateImage(ad, index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MetaAdsTab;
