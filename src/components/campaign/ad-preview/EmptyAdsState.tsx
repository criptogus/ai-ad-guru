
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";

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
  const getPlatformName = () => {
    switch (platform) {
      case "google":
        return "Google";
      case "meta":
        return "Instagram";
      case "linkedin":
        return "LinkedIn";
      case "microsoft":
        return "Microsoft";
      default:
        return platform;
    }
  };

  const getCreditsUsage = () => {
    switch (platform) {
      case "google":
      case "meta":
      case "microsoft":
      case "linkedin":
        return "5 credits";
      default:
        return "credits";
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4 text-center">
          No {getPlatformName()} ads generated yet. 
          <br />
          Click the button below to generate AI-powered ad variations.
        </p>
        {onGenerate && (
          <>
            <Button 
              onClick={onGenerate} 
              disabled={isGenerating}
              className="flex items-center gap-2 mb-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Generate {getPlatformName()} Ads
                </>
              )}
            </Button>
            <div className="text-xs text-muted-foreground">
              This will use {getCreditsUsage()}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyAdsState;
