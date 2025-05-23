
import React, { useState } from "react";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

interface CampaignAdUpdatesProps {
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  setGoogleAds: (ads: GoogleAd[]) => void;
  setMetaAds: (ads: MetaAd[]) => void;
  setCampaignData: React.Dispatch<React.SetStateAction<any>>;
  handleGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
}

const CampaignAdUpdates: React.FC<CampaignAdUpdatesProps> = ({
  googleAds,
  metaAds,
  setGoogleAds,
  setMetaAds,
  setCampaignData,
  handleGenerateImage,
}) => {
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);

  // Handle updates to Google ads
  const handleUpdateGoogleAd = (index: number, updatedAd: GoogleAd) => {
    const updatedAds = [...googleAds];
    updatedAds[index] = updatedAd;
    setGoogleAds(updatedAds);
    
    // Update campaign data as well
    setCampaignData((prev: any) => ({
      ...prev,
      googleAds: updatedAds
    }));
  };

  // Handle updates to Meta ads
  const handleUpdateMetaAd = (index: number, updatedAd: MetaAd) => {
    const updatedAds = [...metaAds];
    updatedAds[index] = updatedAd;
    setMetaAds(updatedAds);
    
    // Update campaign data as well
    setCampaignData((prev: any) => ({
      ...prev,
      metaAds: updatedAds
    }));
  };

  // Wrapper for handling image generation with loading state
  const handleGenerateImageWrapper = async (ad: MetaAd, index: number) => {
    setLoadingImageIndex(index);
    await handleGenerateImage(ad, index);
    setLoadingImageIndex(null);
  };

  return (
    <div>
      {/* This component now returns JSX instead of an object */}
      {/* Hidden component that just manages state and provides functions via props.children */}
      {React.Children.only(
        React.cloneElement(
          // @ts-ignore - This is a valid pattern even though TypeScript doesn't like it
          <>{children}</>, 
          { 
            handleUpdateGoogleAd, 
            handleUpdateMetaAd, 
            handleGenerateImageWrapper, 
            loadingImageIndex 
          }
        )
      )}
    </div>
  );
};

// Create a hook to use instead of the component
export const useCampaignAdUpdates = ({
  googleAds,
  metaAds,
  setGoogleAds,
  setMetaAds,
  setCampaignData,
  handleGenerateImage,
}: CampaignAdUpdatesProps) => {
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);

  // Handle updates to Google ads
  const handleUpdateGoogleAd = (index: number, updatedAd: GoogleAd) => {
    const updatedAds = [...googleAds];
    updatedAds[index] = updatedAd;
    setGoogleAds(updatedAds);
    
    // Update campaign data as well
    setCampaignData((prev: any) => ({
      ...prev,
      googleAds: updatedAds
    }));
  };

  // Handle updates to Meta ads
  const handleUpdateMetaAd = (index: number, updatedAd: MetaAd) => {
    const updatedAds = [...metaAds];
    updatedAds[index] = updatedAd;
    setMetaAds(updatedAds);
    
    // Update campaign data as well
    setCampaignData((prev: any) => ({
      ...prev,
      metaAds: updatedAds
    }));
  };

  // Wrapper for handling image generation with loading state
  const handleGenerateImageWrapper = async (ad: MetaAd, index: number) => {
    setLoadingImageIndex(index);
    await handleGenerateImage(ad, index);
    setLoadingImageIndex(null);
  };

  return {
    handleUpdateGoogleAd,
    handleUpdateMetaAd,
    handleGenerateImageWrapper,
    loadingImageIndex
  };
};

export default CampaignAdUpdates;
