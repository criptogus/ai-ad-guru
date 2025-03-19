
import React, { useRef, useState, useEffect } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
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
  onUpdateAd?: (updatedAd: MetaAd) => void; 
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  ad,
  companyName,
  imageKey,
  loadingImageIndex,
  index,
  onGenerateImage,
  onUpdateAd
}) => {
  const isLoading = loadingImageIndex !== undefined && index !== undefined && loadingImageIndex === index;
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast: uiToast } = useToast();
  
  // Force React to re-render the image when imageUrl changes
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  
  // Update timestamp whenever the image URL changes to force re-render
  useEffect(() => {
    if (ad.imageUrl) {
      const newTimestamp = Date.now();
      setImageTimestamp(newTimestamp);
      console.log(`Image timestamp updated for URL: ${ad.imageUrl} (${newTimestamp})`);
    }
  }, [ad.imageUrl]);

  // Debug the ad prop
  useEffect(() => {
    console.log("InstagramPreview - Ad data:", JSON.stringify(ad, null, 2));
    if (ad.imageUrl) {
      // Attempt to ping the image URL to check if it's accessible
      fetch(ad.imageUrl, { method: 'HEAD' })
        .then(response => {
          console.log(`Image URL accessibility check: ${response.status} ${response.statusText}`);
          if (!response.ok) {
            console.error(`Image URL not accessible: ${ad.imageUrl}`);
          }
        })
        .catch(error => {
          console.error("Image URL accessibility check failed:", error);
        });
    }
  }, [ad]);

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

    setIsUploading(true);

    try {
      // Create a unique file name using timestamp and original name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-user-uploaded.${fileExt}`;
      const filePath = `instagram-ads/${fileName}`;

      // Check if ai-images bucket exists, create if not
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketName = 'ai-images'; // Use the same bucket as the AI generated images
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        const { error: bucketError } = await supabase.storage
          .createBucket(bucketName, {
            public: true
          });
        
        if (bucketError) throw bucketError;
      }

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get the public URL
      const imageUrl = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath).data.publicUrl;

      console.log("Image uploaded successfully, URL:", imageUrl);

      toast.success("Image uploaded successfully", {
        description: "Your image has been added to the ad.",
        duration: 3000,
      });
      
      // Trigger re-render with new timestamp
      setImageTimestamp(Date.now());
      
      // Create updated ad with new image URL
      const updatedAd = { ...ad, imageUrl: imageUrl };
      
      // Call parent update function if provided
      if (onUpdateAd) {
        console.log("Updating parent component with new image URL:", imageUrl);
        onUpdateAd(updatedAd);
      } else {
        console.warn("onUpdateAd callback not provided - image URL won't be saved to ad state");
      }
      
      // Force browser to reload the image (avoiding cache issues)
      const img = new Image();
      img.src = `${imageUrl}?t=${Date.now()}`;
      img.onload = () => {
        console.log("Image preloaded successfully");
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image", {
        description: "Please try again later.",
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
    fileInputRef.current?.click();
  };

  return (
    <div className="border rounded-lg overflow-hidden mb-4 max-w-md mx-auto bg-white shadow-sm">
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
