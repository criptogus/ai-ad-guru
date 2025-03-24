
import { useCallback } from "react";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

interface UseAdGenerationWrappersProps {
  handleGenerateGoogleAds: () => Promise<GoogleAd[] | null>;
  handleGenerateMetaAds: () => Promise<MetaAd[] | null>;
  handleGenerateMicrosoftAds: () => Promise<any[] | null>;
}

export const useAdGenerationWrappers = ({
  handleGenerateGoogleAds,
  handleGenerateMetaAds,
  handleGenerateMicrosoftAds
}: UseAdGenerationWrappersProps) => {
  
  const wrappedHandleGenerateGoogleAds = useCallback(async (): Promise<void> => {
    try {
      await handleGenerateGoogleAds();
    } catch (error) {
      console.error("Error generating Google ads:", error);
    }
  }, [handleGenerateGoogleAds]);

  const wrappedHandleGenerateMetaAds = useCallback(async (): Promise<void> => {
    try {
      await handleGenerateMetaAds();
    } catch (error) {
      console.error("Error generating Meta ads:", error);
    }
  }, [handleGenerateMetaAds]);

  const wrappedHandleGenerateMicrosoftAds = useCallback(async (): Promise<void> => {
    try {
      await handleGenerateMicrosoftAds();
    } catch (error) {
      console.error("Error generating Microsoft ads:", error);
    }
  }, [handleGenerateMicrosoftAds]);

  return {
    wrappedHandleGenerateGoogleAds,
    wrappedHandleGenerateMetaAds,
    wrappedHandleGenerateMicrosoftAds
  };
};
