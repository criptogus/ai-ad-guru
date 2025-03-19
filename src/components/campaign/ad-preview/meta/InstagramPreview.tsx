
import React, { useState, useRef } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { Image, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";

interface InstagramPreviewProps {
  ad: MetaAd;
  companyName: string;
  imageKey?: number;
  loadingImageIndex?: number | null;
  index?: number;
  onGenerateImage?: () => Promise<void>;
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  ad,
  companyName,
  imageKey,
  loadingImageIndex,
  index,
  onGenerateImage
}) => {
  const isLoading = loadingImageIndex !== undefined && index !== undefined && loadingImageIndex === index;
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast: uiToast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      uiToast({
        title: "Invalid File",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      uiToast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setImageError(false);

    try {
      // Create a unique file name using timestamp and original name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-user-uploaded.${fileExt}`;
      const filePath = `instagram-ads/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('ads-images')
        .upload(filePath, file);

      if (error) throw error;

      // Get the public URL
      const imageUrl = supabase.storage
        .from('ads-images')
        .getPublicUrl(filePath).data.publicUrl;

      // Notify the parent component about the new image URL
      // This would require modifying the parent components to handle this case
      // For now, we'll display a toast and reload the page to show the changes
      uiToast({
        title: "Image Uploaded",
        description: "Your image has been uploaded successfully. You'll need to use the 'Update' button to save it to your ad.",
      });

      // Simulate an image URL update by reloading the page
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error("Error uploading image:", error);
      uiToast({
        title: "Upload Failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border rounded-lg overflow-hidden mb-4 max-w-md mx-auto bg-white">
      {/* Header */}
      <div className="bg-white p-3 border-b flex items-center">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
        <div className="ml-2 flex-grow">
          <div className="font-semibold text-sm">{companyName}</div>
          <div className="text-xs text-gray-500">Sponsored</div>
        </div>
        <div className="text-gray-500">•••</div>
      </div>
      
      {/* Image */}
      <div className="bg-gray-100 aspect-square relative">
        {ad.imageUrl && !imageError ? (
          <img 
            key={imageKey}
            src={ad.imageUrl} 
            alt={ad.headline}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Image failed to load:", ad.imageUrl);
              setImageError(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <Image size={40} className="text-gray-400 mb-2" />
            {isLoading || isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-4 w-4 animate-spin mb-1" />
                <span className="text-sm text-gray-500">
                  {isUploading ? "Uploading image..." : "Generating image..."}
                </span>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 text-center mb-2">
                  {imageError ? "Failed to load image" : "No image generated yet"}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {onGenerateImage && (
                    <Button 
                      variant="default"
                      size="sm"
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      onClick={onGenerateImage}
                      disabled={isLoading || isUploading}
                    >
                      {imageError ? "Try Again" : "Generate Image"}
                      <span className="ml-1 text-xs">(5 credits)</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3 py-1 text-sm rounded flex items-center gap-1"
                    onClick={triggerFileUpload}
                    disabled={isLoading || isUploading}
                  >
                    <Upload size={14} />
                    Upload Image
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Caption */}
      <div className="bg-white p-3">
        <div className="flex items-center space-x-4 mb-2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 8.7-8.7a.97.97 0 0 1 1.41 0l6.89 6.89" /><path d="M13 13.8 21 21" /><path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
        </div>
        
        <div>
          <span className="font-semibold text-sm">{companyName}</span>
          <span className="text-sm"> {ad.primaryText}</span>
        </div>
        
        <div className="mt-1 text-sm">
          <span className="font-semibold">{ad.headline}</span>
          <span className="text-gray-500"> {ad.description}</span>
        </div>
        
        <div className="mt-2">
          <button className="w-full py-1.5 rounded bg-[#0095f6] text-white font-semibold text-sm">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstagramPreview;
