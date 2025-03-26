
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface AdFormActionsProps {
  isGenerating: boolean;
  hasPromptContent: boolean;
  onGenerate: () => Promise<void>;
  onReset: () => void;
}

const AdFormActions: React.FC<AdFormActionsProps> = ({
  isGenerating,
  hasPromptContent,
  onGenerate,
  onReset
}) => {
  return (
    <div className="flex flex-col gap-3 pt-2">
      <Button 
        onClick={onGenerate}
        disabled={isGenerating || !hasPromptContent}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {isGenerating ? "Generating..." : "Generate Image"}
      </Button>
      <Button variant="outline" onClick={onReset}>
        Reset Form
      </Button>
    </div>
  );
};

export default AdFormActions;
