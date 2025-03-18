
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";

interface AiTargetingButtonProps {
  isGeneratingTargeting: boolean;
  generateTargetingRecommendations: () => Promise<void>;
}

const AiTargetingButton: React.FC<AiTargetingButtonProps> = ({
  isGeneratingTargeting,
  generateTargetingRecommendations,
}) => {
  return (
    <Button 
      onClick={generateTargetingRecommendations} 
      disabled={isGeneratingTargeting}
      className="w-full"
      variant="outline"
    >
      {isGeneratingTargeting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating targeting recommendations...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate AI Targeting Recommendations
        </>
      )}
    </Button>
  );
};

export default AiTargetingButton;
