
import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyAdsStateProps {
  platform: string;
  isGenerating: boolean;
}

const EmptyAdsState: React.FC<EmptyAdsStateProps> = ({ 
  platform,
  isGenerating
}) => {
  return (
    <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg p-8 text-center">
      <div className="mx-auto max-w-md space-y-4">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium text-muted-foreground">
              Generating {platform}...
            </p>
            <p className="text-sm text-muted-foreground">
              This may take a few moments as our AI crafts the perfect ad copy.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">No {platform} Generated Yet</h3>
            <p className="text-sm text-muted-foreground">
              Click the "Generate Ads" button above to create {platform} based on your website analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyAdsState;
