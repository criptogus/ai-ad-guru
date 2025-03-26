
import React from "react";
import { Loader, ImagePlus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LinkedInImagePlaceholderProps {
  isLoading: boolean;
  isUploading?: boolean;
  imageError?: boolean;
  onGenerateImage?: () => Promise<void>;
  triggerFileUpload?: () => void;
  format?: string;
}

const LinkedInImagePlaceholder: React.FC<LinkedInImagePlaceholderProps> = ({
  isLoading,
  isUploading = false,
  imageError = false,
  onGenerateImage,
  triggerFileUpload,
  format = "landscape"
}) => {
  // Determine dimensions hint based on format
  const getDimensionsHint = () => {
    if (format === "portrait") {
      return "4:5 ratio";
    } else if (format === "landscape") {
      return "1.91:1 ratio";
    }
    return "1:1 ratio";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Loader className="w-10 h-10 text-blue-500 animate-spin mb-3" />
        <p className="text-sm text-gray-500 font-medium">Generating image...</p>
        <p className="text-xs text-gray-400 mt-1">This may take a moment</p>
      </div>
    );
  }

  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Loader className="w-10 h-10 text-blue-500 animate-spin mb-3" />
        <p className="text-sm text-gray-500 font-medium">Uploading image...</p>
      </div>
    );
  }

  if (imageError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center">
        <AlertTriangle className="w-10 h-10 text-orange-500 mb-3" />
        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Image failed to load</p>
        <div className="flex gap-2 mt-3">
          {onGenerateImage && (
            <Button size="sm" variant="outline" onClick={onGenerateImage}>
              Regenerate
            </Button>
          )}
          {triggerFileUpload && (
            <Button size="sm" variant="outline" onClick={triggerFileUpload}>
              Upload
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center">
      <ImagePlus className="w-12 h-12 text-gray-400 mb-3" />
      <p className="text-sm text-gray-500 font-medium">No image available</p>
      <p className="text-xs text-gray-400 mt-1">{getDimensionsHint()}</p>
      <div className="flex gap-2 mt-3">
        {onGenerateImage && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onGenerateImage}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 border-0"
          >
            Generate AI Image
          </Button>
        )}
        {triggerFileUpload && (
          <Button size="sm" variant="outline" onClick={triggerFileUpload}>
            Upload Image
          </Button>
        )}
      </div>
    </div>
  );
};

export default LinkedInImagePlaceholder;
