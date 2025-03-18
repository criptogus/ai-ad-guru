
import { useEffect } from "react";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

export const useCampaignDataSync = (
  adGenerationGoogleAds: GoogleAd[] | null,
  adGenerationMetaAds: MetaAd[] | null,
  setGoogleAds: (ads: GoogleAd[]) => void,
  setMetaAds: (ads: MetaAd[]) => void
) => {
  // Sync Google ads from the adGeneration hook to the campaign context
  useEffect(() => {
    if (adGenerationGoogleAds && adGenerationGoogleAds.length > 0) {
      setGoogleAds(adGenerationGoogleAds);
    }
  }, [adGenerationGoogleAds, setGoogleAds]);

  // Sync Meta ads from the adGeneration hook to the campaign context
  useEffect(() => {
    if (adGenerationMetaAds && adGenerationMetaAds.length > 0) {
      setMetaAds(adGenerationMetaAds);
    }
  }, [adGenerationMetaAds, setMetaAds]);
};
