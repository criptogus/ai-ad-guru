
import React, { useRef, useState } from "react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LinkedInImageDisplayProps {
  imageUrl?: string;
  isGeneratingImage?: boolean;
  onGenerateImage?: () => Promise<void>;
  onUploadImage?: (file: File) => Promise<void>;
  imageFormat?: string;
}

const LinkedInImageDisplay: React.FC<LinkedInImageDisplayProps> = ({
  imageUrl,
  isGeneratingImage = false,
  onGenerateImage,
  onUploadImage,
  imageFormat = "square"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const getImageDimensions = () => {
    switch (imageFormat) {
      case "square":
        return "aspect-square";
      case "landscape":
        return "aspect-[1.91/1]";
      case "portrait":
        return "aspect-[4/5]";
      default:
        return "aspect-square";
    }
  };
  
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;
    
    try {
      setIsUploading(true);
      await onUploadImage(file);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  return (
    <div className={`w-full ${getImageDimensions()} relative overflow-hidden bg-gray-100 rounded-md`}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt="LinkedIn Ad" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
          {isGeneratingImage || isUploading ? (
            <div className="flex flex-col items-center">
              <Loader className="h-8 w-8 animate-spin text-blue-600 mb-2" />
              <p className="text-sm text-gray-500">
                {isGeneratingImage ? "Generating image..." : "Uploading image..."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-3">
              <p className="text-sm text-gray-500">
                No image available
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                {onGenerateImage && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onGenerateImage}
                    className="group relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">Generate AI Image</span>
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleFileSelect}
                >
                  Upload Image
                </Button>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                <p>Recommended specs:</p>
                <p>• Square: 1200 x 1200px</p>
                <p>• Landscape: 1200 x 628px</p>
                <p>• Max file size: 5MB</p>
                <p>• Formats: JPG, PNG</p>
              </div>
            </div>
          )}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg, image/png"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default LinkedInImageDisplay;
