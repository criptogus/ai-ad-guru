
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export interface EmptyAdsStateProps {
  platform: string;
  isGenerating: boolean;
  onGenerate?: () => Promise<void>;
}

const EmptyAdsState: React.FC<EmptyAdsStateProps> = ({
  platform,
  isGenerating,
  onGenerate
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-muted/30 border border-dashed rounded-md">
      <div className="text-muted-foreground mb-4 text-center max-w-md">
        <h3 className="text-lg font-semibold mb-2">No {platform} ads generated yet</h3>
        <p>Click the generate button to create AI-powered ad variations optimized for your business.</p>
      </div>
      
      {onGenerate && (
        <Button 
          onClick={onGenerate} 
          disabled={isGenerating}
          className="mt-2"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isGenerating ? "Generating..." : `Generate ${platform} Ads`}
        </Button>
      )}
    </div>
  );
};

export default EmptyAdsState;
