
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";

interface AiFillButtonProps {
  isGenerating: boolean;
  onClick: () => Promise<void>;
}

const AiFillButton: React.FC<AiFillButtonProps> = ({
  isGenerating,
  onClick
}) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={isGenerating}
      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 border border-purple-300 dark:border-purple-800"
      size="lg"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          AI is filling your campaign details...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-5 w-5 animate-pulse" />
          Fill Campaign with AI
        </>
      )}
    </Button>
  );
};

export default AiFillButton;
