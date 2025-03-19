
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
      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 border border-purple-300 dark:border-purple-800"
      size="lg"
    >
      {isGeneratingTargeting ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Generating targeting recommendations...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-5 w-5 animate-pulse" />
          Generate AI Targeting Recommendations
        </>
      )}
    </Button>
  );
};

export default AiTargetingButton;
