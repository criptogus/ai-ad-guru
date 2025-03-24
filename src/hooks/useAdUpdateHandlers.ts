
import { useCallback } from "react";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

interface UseAdUpdateHandlersProps {
  setGoogleAds: React.Dispatch<React.SetStateAction<GoogleAd[]>>;
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  setMicrosoftAds: React.Dispatch<React.SetStateAction<any[]>>;
  setLinkedInAds?: React.Dispatch<React.SetStateAction<MetaAd[]>>;
}

export const useAdUpdateHandlers = ({
  setGoogleAds,
  setMetaAds,
  setMicrosoftAds,
  setLinkedInAds
}: UseAdUpdateHandlersProps) => {
  
  const handleUpdateGoogleAd = useCallback((index: number, updatedAd: GoogleAd) => {
    setGoogleAds(prev => {
      const newAds = [...prev];
      newAds[index] = updatedAd;
      return newAds;
    });
  }, [setGoogleAds]);

  const handleUpdateMetaAd = useCallback((index: number, updatedAd: MetaAd) => {
    setMetaAds(prev => {
      const newAds = [...prev];
      newAds[index] = updatedAd;
      return newAds;
    });
  }, [setMetaAds]);

  const handleUpdateMicrosoftAd = useCallback((index: number, updatedAd: any) => {
    setMicrosoftAds(prev => {
      const newAds = [...prev];
      newAds[index] = updatedAd;
      return newAds;
    });
  }, [setMicrosoftAds]);

  const handleUpdateLinkedInAd = useCallback((index: number, updatedAd: MetaAd) => {
    if (setLinkedInAds) {
      setLinkedInAds(prev => {
        const newAds = [...prev];
        newAds[index] = updatedAd;
        return newAds;
      });
    }
  }, [setLinkedInAds]);

  return {
    handleUpdateGoogleAd,
    handleUpdateMetaAd,
    handleUpdateMicrosoftAd,
    handleUpdateLinkedInAd
  };
};
