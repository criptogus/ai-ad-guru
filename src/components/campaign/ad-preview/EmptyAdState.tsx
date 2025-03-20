
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EmptyAdStateProps {
  platform: string;
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
  buttonText?: string;
}

const EmptyAdState: React.FC<EmptyAdStateProps> = ({ 
  platform, 
  onGenerate, 
  isGenerating,
  buttonText
}) => {
  const platformDisplay = {
    'google': 'Google Ads',
    'meta': 'Instagram Ads',
    'linkedin': 'LinkedIn Ads',
    'microsoft': 'Microsoft Ads'
  }[platform] || platform;

  const defaultButtonText = `Generate ${platformDisplay}`;
  
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <img 
        src={`/images/empty-${platform}.svg`} 
        alt={`No ${platformDisplay}`}
        className="w-24 h-24 mb-4 opacity-50"
        onError={(e) => {
          e.currentTarget.src = "/images/empty-default.svg";
        }}
      />
      
      <h3 className="text-lg font-medium text-gray-700 mb-2">No {platformDisplay} Generated Yet</h3>
      
      <p className="text-gray-500 text-center mb-6 max-w-md">
        Click the button below to generate AI-powered {platformDisplay} based on your website analysis.
      </p>
      
      <Button 
        onClick={onGenerate}
        disabled={isGenerating}
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          buttonText || defaultButtonText
        )}
      </Button>
    </div>
  );
};

export default EmptyAdState;
