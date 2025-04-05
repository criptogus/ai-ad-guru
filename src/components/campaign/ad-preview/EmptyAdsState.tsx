
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";

export interface EmptyAdsStateProps {
  platform: string;
  onGenerate?: () => Promise<void>;
  isGenerating?: boolean;
}

const EmptyAdsState: React.FC<EmptyAdsStateProps> = ({
  platform,
  onGenerate,
  isGenerating = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed rounded-lg">
      <p className="mb-4 text-muted-foreground">No {platform} ads generated yet</p>
      {onGenerate && (
        <Button 
          onClick={onGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              Generate {platform} Ads
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default EmptyAdsState;
