
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Image, Upload } from "lucide-react";
import { toast } from "sonner";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Set dimensions based on format (square or landscape)
  const imageClass = imageFormat === "square" 
    ? "aspect-square w-full object-cover" 
    : "aspect-[1200/627] w-full object-cover";
    
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // LinkedIn image size validation
    const maxSizeInMB = 5;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSizeInMB}MB limit`, {
        description: "LinkedIn requires images under 5MB"
      });
      return;
    }
    
    if (onUploadImage) {
      onUploadImage(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (isGeneratingImage) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${imageClass}`}>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Generating image...</p>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${imageClass}`}>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Image className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-4">No image yet</p>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
            {onGenerateImage && (
              <Button 
                variant="default" 
                size="sm" 
                className="group relative overflow-hidden"
                onClick={onGenerateImage}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center justify-center">
                  Generate AI Image
                </span>
              </Button>
            )}
            
            {onUploadImage && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleUploadClick}
                  className="flex items-center gap-1"
                >
                  <Upload size={14} />
                  Upload Image
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/gif" 
                />
              </>
            )}
          </div>
          
          <div className="mt-3 text-xs text-gray-400 max-w-xs text-center">
            <p>LinkedIn image specs:</p>
            <p>• Square: 1080×1080px</p>
            <p>• Landscape: 1200×627px</p>
            <p>• Max size: 5MB</p>
            <p>• Formats: JPG, PNG, GIF</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden relative group">
      {imageUrl ? (
        <>
          <img 
            src={imageUrl} 
            alt="LinkedIn Ad" 
            className={imageClass} 
          />
          {onUploadImage && (
            <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleUploadClick}
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
              >
                <Upload size={14} className="mr-1" />
                Replace
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/gif" 
              />
            </div>
          )}
        </>
      ) : (
        <div className={`bg-gray-100 flex items-center justify-center ${imageClass}`}>
          <Image className="h-10 w-10 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default LinkedInImageDisplay;
