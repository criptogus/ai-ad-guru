
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
  // Create wrapper functions that have the correct return types
  const wrappedHandleGenerateGoogleAds = async (): Promise<GoogleAd[] | null> => {
    await handleGenerateGoogleAds();
    return null; // Return null as a fallback
  };

  const wrappedHandleGenerateMetaAds = async (): Promise<MetaAd[] | null> => {
    await handleGenerateMetaAds();
    return null; // Return null as a fallback
  };

  const wrappedHandleGenerateMicrosoftAds = async (): Promise<any[] | null> => {
    await handleGenerateMicrosoftAds();
    return null; // Return null as a fallback
  };

  return {
    wrappedHandleGenerateGoogleAds,
    wrappedHandleGenerateMetaAds,
    wrappedHandleGenerateMicrosoftAds
  };
};
