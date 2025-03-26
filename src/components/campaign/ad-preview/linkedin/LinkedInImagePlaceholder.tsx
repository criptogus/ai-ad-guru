
import React from "react";
import { ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LinkedInImagePlaceholderProps {
  isLoading?: boolean;
  isGenerating?: boolean;
  onGenerate?: () => Promise<void>;
  format?: "square" | "landscape" | "portrait";
}

const LinkedInImagePlaceholder: React.FC<LinkedInImagePlaceholderProps> = ({
  isLoading = false,
  isGenerating = false,
  onGenerate,
  format = "landscape"
}) => {
  const formatClass = format === "square" ? "aspect-square" : 
                     format === "portrait" ? "aspect-[4/5]" : "aspect-video";

  return (
    <div className={`w-full ${formatClass} flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800`}>
      <div className="mb-3">
        <ImageIcon className="h-10 w-10 text-gray-300 dark:text-gray-600" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
        Add an image to enhance your LinkedIn ad
      </p>
      
      {onGenerate && (
        <Button 
          onClick={onGenerate}
          disabled={isLoading || isGenerating}
          variant="default" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Sparkles className="h-4 w-4" />
          <span>
            {isGenerating ? "Generating..." : "Generate with AI"}
          </span>
        </Button>
      )}
    </div>
  );
};

export default LinkedInImagePlaceholder;
