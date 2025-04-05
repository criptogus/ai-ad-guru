
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";

interface EmptyAdsStateProps {
  platform: "google" | "meta" | "linkedin" | "microsoft";
  isGenerating: boolean;
  onGenerate: () => Promise<void>;
}

const EmptyAdsState: React.FC<EmptyAdsStateProps> = ({
  platform,
  isGenerating,
  onGenerate
}) => {
  const platformLabels = {
    google: "Google Search",
    meta: "Instagram",
    linkedin: "LinkedIn",
    microsoft: "Microsoft/Bing"
  };

  const platformName = platformLabels[platform] || platform;

  return (
    <div className="flex flex-col items-center justify-center py-10 border border-dashed rounded-lg">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">No {platformName} Ads</h3>
        <p className="text-muted-foreground mb-6">
          You haven't generated any {platformName} Ads yet. 
          Click below to create ad variations.
        </p>
        <Button 
          onClick={onGenerate}
          disabled={isGenerating}
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Generate {platformName} Ads
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EmptyAdsState;
