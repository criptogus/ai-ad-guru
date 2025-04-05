
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

export interface UseAdUpdateHandlersProps {
  setGoogleAds: React.Dispatch<React.SetStateAction<GoogleAd[]>>;
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  setMicrosoftAds: React.Dispatch<React.SetStateAction<any[]>>;
  setLinkedInAds?: React.Dispatch<React.SetStateAction<any[]>>;
}

export const useAdUpdateHandlers = ({
  setGoogleAds,
  setMetaAds,
  setMicrosoftAds,
  setLinkedInAds
}: UseAdUpdateHandlersProps) => {
  const handleUpdateGoogleAd = (index: number, updatedAd: GoogleAd) => {
    setGoogleAds(prev => {
      const newAds = [...prev];
      newAds[index] = updatedAd;
      return newAds;
    });
  };

  const handleUpdateMetaAd = (index: number, updatedAd: MetaAd) => {
    setMetaAds(prev => {
      const newAds = [...prev];
      newAds[index] = updatedAd;
      return newAds;
    });
  };

  const handleUpdateMicrosoftAd = (index: number, updatedAd: any) => {
    setMicrosoftAds(prev => {
      const newAds = [...prev];
      newAds[index] = updatedAd;
      return newAds;
    });
  };

  const handleUpdateLinkedInAd = (index: number, updatedAd: any) => {
    if (setLinkedInAds) {
      setLinkedInAds(prev => {
        const newAds = [...prev];
        newAds[index] = updatedAd;
        return newAds;
      });
    }
  };

  return {
    handleUpdateGoogleAd,
    handleUpdateMetaAd,
    handleUpdateMicrosoftAd,
    handleUpdateLinkedInAd
  };
};
