
import React from "react";
import { Loader2, Image, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LinkedInImagePlaceholderProps {
  isLoading: boolean;
  isUploading?: boolean;
  imageError?: boolean;
  onGenerate?: () => Promise<void>;
  triggerFileUpload?: () => void;
  format?: string;
  isGenerating?: boolean; // Added missing prop
}

const LinkedInImagePlaceholder: React.FC<LinkedInImagePlaceholderProps> = ({
  isLoading,
  isUploading = false,
  imageError = false,
  onGenerate,
  triggerFileUpload,
  format = "landscape",
  isGenerating = false, // Added with default value
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
      {isLoading || isUploading ? (
        <div className="flex flex-col items-center justify-center text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isUploading ? "Uploading image..." : "Generating professional LinkedIn image..."}
          </p>
        </div>
      ) : imageError ? (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 mb-3">
            <Image className="h-8 w-8 text-red-500 dark:text-red-400" />
          </div>
          <p className="text-sm font-medium mb-1 text-red-500 dark:text-red-400">Image failed to load</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Please try again or upload a different image
          </p>
          <div className="flex gap-2">
            {onGenerate && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onGenerate}
                className="gap-1"
              >
                <Plus className="h-4 w-4 mr-1" />
                Regenerate
              </Button>
            )}
            {triggerFileUpload && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={triggerFileUpload}
                className="gap-1"
              >
                <Image className="h-4 w-4 mr-1" />
                Upload Image
              </Button>
            )}
          </div>
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
          <div className="flex gap-2">
            {onGenerate && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onGenerate}
                className="gap-1"
                disabled={isLoading || isUploading}
              >
                <Plus className="h-4 w-4 mr-1" />
                Generate Image
              </Button>
            )}
            {triggerFileUpload && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={triggerFileUpload}
                className="gap-1"
                disabled={isLoading || isUploading}
              >
                <Image className="h-4 w-4 mr-1" />
                Upload Image
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInImagePlaceholder;
