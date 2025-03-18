
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EmptyAdStateProps {
  platform: 'google' | 'meta';
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
}

const EmptyAdState: React.FC<EmptyAdStateProps> = ({ platform, onGenerate, isGenerating }) => {
  const title = platform === 'google' ? 'Generate Google Search Ads' : 'Generate Meta/Instagram Ads';
  const description = platform === 'google' 
    ? 'Our AI will create high-converting Google Search ads based on your website analysis.'
    : 'Our AI will create engaging Meta/Instagram ads with captions and generated images.';
  const buttonText = platform === 'google' ? 'Generate Google Ads' : 'Generate Meta Ads';

  return (
    <div className="text-center p-6 bg-muted/30 rounded-md">
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {description}
      </p>
      <Button 
        onClick={onGenerate} 
        disabled={isGenerating}
        className="w-full sm:w-auto"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          buttonText
        )}
      </Button>
    </div>
  );
};

export default EmptyAdState;
