
import { GoogleAd, MetaAd } from '@/hooks/adGeneration';

interface UseAdGenerationWrappersProps {
  handleGenerateGoogleAds: () => Promise<void>;
  handleGenerateMetaAds: () => Promise<void>;
  handleGenerateMicrosoftAds: () => Promise<void>;
}

export const useAdGenerationWrappers = ({
  handleGenerateGoogleAds,
  handleGenerateMetaAds,
  handleGenerateMicrosoftAds
}: UseAdGenerationWrappersProps) => {
  // Create wrapper functions that return the correct types for the component
  const wrappedHandleGenerateGoogleAds = async (): Promise<void> => {
    await handleGenerateGoogleAds();
  };

  const wrappedHandleGenerateMetaAds = async (): Promise<void> => {
    await handleGenerateMetaAds();
  };

  const wrappedHandleGenerateMicrosoftAds = async (): Promise<void> => {
    await handleGenerateMicrosoftAds();
  };

  return {
    wrappedHandleGenerateGoogleAds,
    wrappedHandleGenerateMetaAds,
    wrappedHandleGenerateMicrosoftAds
  };
};
