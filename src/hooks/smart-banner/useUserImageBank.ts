
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUserImageBank = (userId: string | undefined) => {
  const [userImages, setUserImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Load user images from storage
  useEffect(() => {
    const fetchUserImages = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .storage
          .from('banner-images')
          .list(userId);
        
        if (error) {
          console.error('Error fetching user images:', error);
          return;
        }
        
        if (data) {
          const imageUrls = await Promise.all(
            data.map(async (file) => {
              const { data: urlData } = await supabase
                .storage
                .from('banner-images')
                .getPublicUrl(`${userId}/${file.name}`);
              
              return urlData.publicUrl;
            })
          );
          
          setUserImages(imageUrls);
        }
      } catch (error) {
        console.error('Error processing user images:', error);
      }
    };
    
    fetchUserImages();
  }, [userId]);

  // Upload a custom image
  const uploadImage = async (file: File): Promise<string | null> => {
    if (!userId) {
      toast.error("Please log in to upload images");
      return null;
    }
    
    setIsUploading(true);
    
    try {
      // First display the image locally
      const fileReader = new FileReader();
      
      const result = await new Promise<string>((resolve, reject) => {
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.onerror = reject;
        fileReader.readAsDataURL(file);
      });
      
      // Then save to storage
      const filename = `upload-${Date.now()}-${file.name}`;
      
      const { error } = await supabase
        .storage
        .from('banner-images')
        .upload(`${userId}/${filename}`, file, {
          contentType: file.type,
          upsert: false
        });
      
      if (error) {
        console.error('Error uploading image:', error);
        toast.error("Error saving image to your bank");
        return result; // Still return local file data URL
      }
      
      // Get the public URL
      const { data } = await supabase
        .storage
        .from('banner-images')
        .getPublicUrl(`${userId}/${filename}`);
      
      // Add to user images
      setUserImages(prev => [...prev, data.publicUrl]);
      
      toast.success("Image uploaded successfully and saved to your bank");
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Save an image to the user's image bank
  const saveImageToUserBank = async (imageUrl: string): Promise<void> => {
    if (!userId) return;
    
    try {
      // Fetch the image as a blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Generate a unique filename
      const filename = `banner-${Date.now()}.png`;
      
      // Upload to Supabase Storage
      const { error } = await supabase
        .storage
        .from('banner-images')
        .upload(`${userId}/${filename}`, blob, {
          contentType: 'image/png',
          upsert: false
        });
      
      if (error) {
        console.error('Error saving to image bank:', error);
        return;
      }
      
      // Get the public URL for the uploaded image
      const { data } = await supabase
        .storage
        .from('banner-images')
        .getPublicUrl(`${userId}/${filename}`);
      
      // Add to user images array
      setUserImages(prev => [...prev, data.publicUrl]);
      
      toast.success("Image saved to your bank", {
        description: "You can access it in your image library"
      });
    } catch (error) {
      console.error('Error saving image to bank:', error);
    }
  };

  return {
    userImages,
    isUploading,
    uploadImage,
    saveImageToUserBank,
  };
};
