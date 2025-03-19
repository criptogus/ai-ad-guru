
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Instagram, PenTool, Linkedin } from "lucide-react";

interface EmptyAdStateProps {
  platform: "google" | "meta" | "microsoft" | "linkedin";
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
}

const EmptyAdState: React.FC<EmptyAdStateProps> = ({ 
  platform, 
  onGenerate, 
  isGenerating 
}) => {
  // Platform-specific content
  const platformContent = {
    google: {
      title: "No Google Ads Generated Yet",
      description: "Create text ads optimized for Google Search with high-converting headlines and descriptions.",
      icon: <Search className="h-10 w-10 text-gray-400" />,
      buttonText: "Generate Google Ads"
    },
    meta: {
      title: "No Instagram Ads Generated Yet",
      description: "Create visually appealing ads with compelling captions for Instagram's mobile-first audience.",
      icon: <Instagram className="h-10 w-10 text-gray-400" />,
      buttonText: "Generate Instagram Ads"
    },
    microsoft: {
      title: "No Microsoft Ads Generated Yet",
      description: "Create optimized text ads for Microsoft Advertising and Bing search results.",
      icon: <PenTool className="h-10 w-10 text-gray-400" />,
      buttonText: "Generate Microsoft Ads"
    },
    linkedin: {
      title: "No LinkedIn Ads Generated Yet",
      description: "Create professional ad content optimized for LinkedIn's business audience.",
      icon: <Linkedin className="h-10 w-10 text-gray-400" />,
      buttonText: "Generate LinkedIn Ads"
    }
  };

  const content = platformContent[platform];

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-md border-gray-200 bg-gray-50">
      <div className="text-center space-y-4">
        {content.icon}
        <h3 className="text-lg font-medium">{content.title}</h3>
        <p className="text-sm text-gray-500 max-w-md">
          {content.description}
        </p>
        <Button 
          onClick={onGenerate} 
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : content.buttonText}
        </Button>
      </div>
    </div>
  );
};

export default EmptyAdState;
