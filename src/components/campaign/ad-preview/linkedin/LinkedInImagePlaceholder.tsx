
import React from "react";
import { Loader2, UploadCloud, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TemplateGalleryButton from "../template-gallery/TemplateGalleryButton";

export interface LinkedInImagePlaceholderProps {
  isLoading: boolean;
  isUploading?: boolean;
  isGenerating?: boolean;
  imageError?: boolean;
  onGenerate?: () => Promise<void>;
  triggerFileUpload?: () => void;
  format?: "square" | "landscape" | "portrait";
  onOpenTemplateGallery?: () => void;
}

const LinkedInImagePlaceholder: React.FC<LinkedInImagePlaceholderProps> = ({
  isLoading,
  isUploading = false,
  isGenerating = false,
  imageError = false,
  onGenerate,
  triggerFileUpload,
  format = "landscape",
  onOpenTemplateGallery
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
      {isLoading ? (
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400 dark:text-gray-600" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Generating AI image...</p>
        </div>
      ) : isUploading ? (
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400 dark:text-gray-600" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Uploading image...</p>
        </div>
      ) : imageError ? (
        <div className="text-center space-y-3">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500 dark:text-red-400" />
          <p className="text-sm text-red-500 dark:text-red-400">Failed to load image</p>
          {onGenerate && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onGenerate}
              className="mt-2"
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              Retry Generation
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center space-y-3">
          <div className="mx-auto rounded-full bg-gray-200 dark:bg-gray-700 p-3 w-16 h-16 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-gray-500 dark:text-gray-400"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {format === "landscape" ? "LinkedIn recommended size: 1200x627px" : 
             format === "portrait" ? "LinkedIn post size: 1080x1350px" : 
             "LinkedIn square size: 1080x1080px"}
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {triggerFileUpload && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={triggerFileUpload}
                className="text-xs"
              >
                <UploadCloud className="mr-1 h-3 w-3" />
                Upload
              </Button>
            )}
            
            {onGenerate && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onGenerate}
                className="text-xs"
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                Generate
              </Button>
            )}
            
            {onOpenTemplateGallery && (
              <TemplateGalleryButton onClick={onOpenTemplateGallery} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInImagePlaceholder;
