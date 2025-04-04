
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

export const useAdUpdateHandlers = (
  googleAds: GoogleAd[],
  metaAds: MetaAd[],
  microsoftAds: any[],
  linkedInAds: any[],
  setGoogleAds: (ads: GoogleAd[]) => void,
  setMetaAds: (ads: MetaAd[]) => void,
  setMicrosoftAds: (ads: any[]) => void,
  setLinkedInAds: (ads: any[]) => void
) => {
  const handleUpdateGoogleAd = (index: number, updatedAd: GoogleAd) => {
    const newAds = [...googleAds];
    newAds[index] = updatedAd;
    setGoogleAds(newAds);
  };

  const handleUpdateMetaAd = (index: number, updatedAd: MetaAd) => {
    const newAds = [...metaAds];
    newAds[index] = updatedAd;
    setMetaAds(newAds);
  };

  const handleUpdateMicrosoftAd = (index: number, updatedAd: any) => {
    const newAds = [...microsoftAds];
    newAds[index] = updatedAd;
    setMicrosoftAds(newAds);
  };

  const handleUpdateLinkedInAd = (index: number, updatedAd: any) => {
    const newAds = [...linkedInAds];
    newAds[index] = updatedAd;
    setLinkedInAds(newAds);
  };

  return {
    handleUpdateGoogleAd,
    handleUpdateMetaAd,
    handleUpdateMicrosoftAd,
    handleUpdateLinkedInAd
  };
};
