
import React, { useState, useEffect } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { useAuth } from "@/contexts/AuthContext";
import { 
  InstagramPreviewHeader, 
  InstagramPreviewFooter, 
  ImageContent,
  ImageUploadHandler
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
  const { user } = useAuth();
  
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

  const handleImageUploaded = (imageUrl: string) => {
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
  };

  return (
    <div className="border rounded-lg overflow-hidden mb-4 max-w-md mx-auto bg-white shadow-sm">
      {/* Header */}
      <InstagramPreviewHeader companyName={companyName} />
      
      {/* Image */}
      <ImageUploadHandler 
        onImageUploaded={handleImageUploaded}
        user={user}
      >
        {(triggerFileUpload) => (
          <ImageContent 
            ad={ad}
            imageKey={imageTimestamp} 
            isLoading={isLoading}
            isUploading={isUploading}
            onGenerateImage={onGenerateImage}
            triggerFileUpload={triggerFileUpload}
          />
        )}
      </ImageUploadHandler>
      
      {/* Caption and Footer */}
      <InstagramPreviewFooter ad={ad} companyName={companyName} />
    </div>
  );
};

export default InstagramPreview;
