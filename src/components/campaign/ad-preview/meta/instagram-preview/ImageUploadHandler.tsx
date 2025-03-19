
import React, { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CustomUser } from "@/types/auth";

interface ImageUploadHandlerProps {
  onImageUploaded: (imageUrl: string) => void;
  children: (triggerUpload: () => void) => React.ReactNode;
  user: CustomUser | null;
}

const ImageUploadHandler: React.FC<ImageUploadHandlerProps> = ({ 
  onImageUploaded,
  children,
  user 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file (JPEG, PNG, etc.)", {
        duration: 5000,
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please upload an image smaller than 5MB", {
        duration: 5000,
      });
      return;
    }

    // Ensure user is authenticated
    if (!user) {
      toast.error("You must be logged in to upload images", {
        duration: 5000,
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create a unique file name using timestamp and original name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${user.id.substring(0, 8)}.${fileExt}`;
      const filePath = `instagram-ads/${fileName}`;
      const bucketName = 'ai-images';

      console.log(`Uploading file to ${bucketName}/${filePath}`);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      // Get the public URL using Supabase's built-in method
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      console.log("Image uploaded successfully, URL:", publicUrl);

      toast.success("Image uploaded successfully", {
        description: "Your image has been added to the ad.",
        duration: 3000,
      });
      
      // Call parent with the new image URL
      onImageUploaded(publicUrl);
      
      // Force browser to reload the image (avoiding cache issues)
      const img = new Image();
      img.src = `${publicUrl}?t=${Date.now()}`;
      img.onload = () => {
        console.log("Image preloaded successfully");
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image", {
        description: "Please try again later. You may need to log in to upload images.",
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
      
      // Clear the file input to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileUpload = () => {
    if (!user) {
      toast.error("You must be logged in to upload images", {
        duration: 5000,
      });
      return;
    }
    
    fileInputRef.current?.click();
  };

  return (
    <>
      {children(triggerFileUpload)}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleImageUpload}
      />
    </>
  );
};

export default ImageUploadHandler;
