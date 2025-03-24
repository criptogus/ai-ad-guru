
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface EmptyAdStateProps {
  platform: string;
  onGenerate: () => Promise<any>;
  isGenerating: boolean;
  buttonText?: string;
}

const EmptyAdState: React.FC<EmptyAdStateProps> = ({
  platform,
  onGenerate,
  isGenerating,
  buttonText = `Generate ${platform} Ads`
}) => {
  return (
    <div className="text-center py-10 px-6 border border-dashed rounded-lg bg-muted/30">
      <h3 className="text-lg font-medium mb-2">No {platform} Ads Created Yet</h3>
      <p className="text-muted-foreground mb-6">
        Generate AI-powered ads based on your website analysis
      </p>
      <Button 
        onClick={onGenerate} 
        disabled={isGenerating}
        className="group relative overflow-hidden"
      >
        {isGenerating ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <span className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">{buttonText}</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default EmptyAdState;
