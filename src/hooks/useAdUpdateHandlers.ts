
import { useCallback } from "react";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

interface UseAdUpdateHandlersProps {
  setGoogleAds: React.Dispatch<React.SetStateAction<GoogleAd[]>>;
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  setMicrosoftAds: React.Dispatch<React.SetStateAction<any[]>>;
}

export const useAdUpdateHandlers = ({
  setGoogleAds,
  setMetaAds,
  setMicrosoftAds
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

  return {
    handleUpdateGoogleAd,
    handleUpdateMetaAd,
    handleUpdateMicrosoftAd
  };
};
