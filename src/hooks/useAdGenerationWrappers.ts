
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
  
  // These wrapper functions properly handle the return types
  const wrappedHandleGenerateGoogleAds = useCallback(async (): Promise<GoogleAd[] | null> => {
    try {
      return await handleGenerateGoogleAds();
    } catch (error) {
      console.error("Error generating Google ads:", error);
      return null;
    }
  }, [handleGenerateGoogleAds]);

  const wrappedHandleGenerateMetaAds = useCallback(async (): Promise<MetaAd[] | null> => {
    try {
      return await handleGenerateMetaAds();
    } catch (error) {
      console.error("Error generating Meta ads:", error);
      return null;
    }
  }, [handleGenerateMetaAds]);

  const wrappedHandleGenerateMicrosoftAds = useCallback(async (): Promise<any[] | null> => {
    try {
      return await handleGenerateMicrosoftAds();
    } catch (error) {
      console.error("Error generating Microsoft ads:", error);
      return null;
    }
  }, [handleGenerateMicrosoftAds]);

  return {
    wrappedHandleGenerateGoogleAds,
    wrappedHandleGenerateMetaAds,
    wrappedHandleGenerateMicrosoftAds
  };
};
