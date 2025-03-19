
import React, { useRef, useState, useEffect } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  InstagramPreviewHeader, 
  InstagramPreviewFooter, 
  ImageContent 
} from "./instagram-preview";

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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Force React to re-render the image when imageUrl changes
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  
  useEffect(() => {
    // Update the timestamp whenever the image URL changes
    if (ad.imageUrl) {
      setImageTimestamp(Date.now());
    }
  }, [ad.imageUrl]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsUploading(true);

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
      toast({
        title: "Image Uploaded",
        description: "Your image has been uploaded successfully. You'll need to use the 'Update' button to save it to your ad.",
        duration: 3000,
      });

      // Simulate an image URL update by reloading the page
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
        duration: 3000,
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
      <InstagramPreviewHeader companyName={companyName} />
      
      {/* Image */}
      <ImageContent 
        ad={ad}
        imageKey={imageTimestamp} // Use timestamp as key to force re-render
        isLoading={isLoading}
        isUploading={isUploading}
        onGenerateImage={onGenerateImage}
        triggerFileUpload={triggerFileUpload}
      />
      
      {/* Caption and Footer */}
      <InstagramPreviewFooter ad={ad} companyName={companyName} />
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default InstagramPreview;
