
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
  const { toast: uiToast } = useToast();
  
  // Force React to re-render the image when imageUrl changes
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  
  useEffect(() => {
    // Update the timestamp whenever the image URL changes
    if (ad.imageUrl) {
      setImageTimestamp(Date.now());
      console.log("Image timestamp updated for URL:", ad.imageUrl);
    }
  }, [ad.imageUrl]);

  // Debug the ad prop to see if imageUrl is present
  useEffect(() => {
    console.log("InstagramPreview - Ad data:", JSON.stringify(ad, null, 2));
    console.log("Image URL from ad:", ad.imageUrl || "No image URL");
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

      // Check if ads-images bucket exists, create if not
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketName = 'ads-images';
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
        .upload(filePath, file);

      if (error) throw error;

      // Get the public URL
      const imageUrl = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath).data.publicUrl;

      // Notify the parent component about the new image URL
      toast.success("Image uploaded successfully", {
        description: "You'll need to use the 'Update' button to save it to your ad.",
        duration: 3000,
      });

      // Set a temporary state to show the image
      setImageTimestamp(Date.now());

      // Force browser to reload the image (avoiding cache issues)
      const img = new Image();
      img.src = imageUrl + '?t=' + Date.now();
      img.onload = () => {
        console.log("Image preloaded successfully");
      };

    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image", {
        description: "Please try again.",
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
