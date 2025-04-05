
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface EmptyAdsStateProps {
  platform: "google" | "meta" | "linkedin" | "microsoft";
  isGenerating: boolean;
  onGenerate?: () => Promise<void>;
}

const EmptyAdsState: React.FC<EmptyAdsStateProps> = ({
  platform,
  isGenerating,
  onGenerate
}) => {
  const platformDisplayNames = {
    google: "Google Search Ads",
    meta: "Instagram Ads",
    linkedin: "LinkedIn Ads",
    microsoft: "Microsoft Ads"
  };

  const displayName = platformDisplayNames[platform] || platform;

  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-md space-y-4 text-center">
      <div className="text-muted-foreground mb-2">
        <p className="text-lg font-medium">No {displayName} Created Yet</p>
        <p className="text-sm">Generate ads with AI to see them appear here</p>
      </div>
      
      {onGenerate && (
        <Button 
          onClick={onGenerate}
          disabled={isGenerating}
          className="mt-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate {displayName}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default EmptyAdsState;
