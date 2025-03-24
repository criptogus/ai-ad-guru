
import { useCallback } from "react";

interface AdGenerationWrappersProps {
  handleGenerateGoogleAds: () => Promise<any>;
  handleGenerateMetaAds: () => Promise<any>;
  handleGenerateMicrosoftAds: () => Promise<any>;
  handleGenerateLinkedInAds: () => Promise<any>;
}

export const useAdGenerationWrappers = (props: AdGenerationWrappersProps) => {
  const { 
    handleGenerateGoogleAds, 
    handleGenerateMetaAds, 
    handleGenerateMicrosoftAds,
    handleGenerateLinkedInAds
  } = props;

  // Wrap Google ad generation to ensure Promise<void> return type
  const wrappedHandleGenerateGoogleAds = useCallback(async (): Promise<void> => {
    try {
      await handleGenerateGoogleAds();
    } catch (error) {
      console.error("Error generating Google ads:", error);
    }
  }, [handleGenerateGoogleAds]);

  // Wrap Meta ad generation to ensure Promise<void> return type
  const wrappedHandleGenerateMetaAds = useCallback(async (): Promise<void> => {
    try {
      await handleGenerateMetaAds();
    } catch (error) {
      console.error("Error generating Meta ads:", error);
    }
  }, [handleGenerateMetaAds]);

  // Wrap Microsoft ad generation to ensure Promise<void> return type
  const wrappedHandleGenerateMicrosoftAds = useCallback(async (): Promise<void> => {
    try {
      await handleGenerateMicrosoftAds();
    } catch (error) {
      console.error("Error generating Microsoft ads:", error);
    }
  }, [handleGenerateMicrosoftAds]);

  // Wrap LinkedIn ad generation to ensure Promise<void> return type
  const wrappedHandleGenerateLinkedInAds = useCallback(async (): Promise<void> => {
    try {
      await handleGenerateLinkedInAds();
    } catch (error) {
      console.error("Error generating LinkedIn ads:", error);
    }
  }, [handleGenerateLinkedInAds]);

  return {
    wrappedHandleGenerateGoogleAds,
    wrappedHandleGenerateMetaAds,
    wrappedHandleGenerateMicrosoftAds,
    wrappedHandleGenerateLinkedInAds
  };
};

export default useAdGenerationWrappers;
