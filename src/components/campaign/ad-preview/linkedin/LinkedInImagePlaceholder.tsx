
import React from "react";
import { Loader2, Image, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LinkedInImagePlaceholderProps {
  isLoading: boolean;
  onGenerate?: () => Promise<void>;
  format?: string;
}

const LinkedInImagePlaceholder: React.FC<LinkedInImagePlaceholderProps> = ({
  isLoading,
  onGenerate,
  format = "landscape"
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Generating professional LinkedIn image...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-gray-200 dark:bg-gray-700 p-3 mb-3">
            <Image className="h-8 w-8 text-gray-500 dark:text-gray-400" />
          </div>
          <p className="text-sm font-medium mb-1">No image available</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Generate an AI image for your LinkedIn ad
          </p>
          {onGenerate && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onGenerate}
              className="gap-1"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-1" />
              Generate Image
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkedInImagePlaceholder;
