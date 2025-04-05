
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

interface AdUpdateHandlersProps {
  setGoogleAds: React.Dispatch<React.SetStateAction<GoogleAd[]>>;
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  setMicrosoftAds: React.Dispatch<React.SetStateAction<GoogleAd[]>>;
  setLinkedInAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
}

export const useAdUpdateHandlers = ({
  setGoogleAds,
  setMetaAds,
  setMicrosoftAds,
  setLinkedInAds
}: AdUpdateHandlersProps) => {
  // Handle updates to Google ads
  const handleUpdateGoogleAd = (index: number, updatedAd: GoogleAd) => {
    setGoogleAds(prev => {
      const updatedAds = [...prev];
      updatedAds[index] = updatedAd;
      return updatedAds;
    });
  };

  // Handle updates to Meta ads
  const handleUpdateMetaAd = (index: number, updatedAd: MetaAd) => {
    setMetaAds(prev => {
      const updatedAds = [...prev];
      updatedAds[index] = updatedAd;
      return updatedAds;
    });
  };

  // Handle updates to Microsoft ads
  const handleUpdateMicrosoftAd = (index: number, updatedAd: GoogleAd) => {
    setMicrosoftAds(prev => {
      const updatedAds = [...prev];
      updatedAds[index] = updatedAd;
      return updatedAds;
    });
  };

  // Handle updates to LinkedIn ads
  const handleUpdateLinkedInAd = (index: number, updatedAd: MetaAd) => {
    setLinkedInAds(prev => {
      const updatedAds = [...prev];
      updatedAds[index] = updatedAd;
      return updatedAds;
    });
  };

  return {
    handleUpdateGoogleAd,
    handleUpdateMetaAd,
    handleUpdateMicrosoftAd,
    handleUpdateLinkedInAd
  };
};
