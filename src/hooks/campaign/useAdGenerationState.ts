
import { useState } from 'react';
import { GoogleAd, MetaAd } from '@/hooks/adGeneration/types';

export const useAdGenerationState = () => {
  const [googleAds, setGoogleAds] = useState<GoogleAd[]>([]);
  const [metaAds, setMetaAds] = useState<MetaAd[]>([]);
  const [microsoftAds, setMicrosoftAds] = useState<GoogleAd[]>([]);
  const [linkedInAds, setLinkedInAds] = useState<MetaAd[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  return {
    googleAds,
    setGoogleAds,
    metaAds,
    setMetaAds,
    microsoftAds,
    setMicrosoftAds,
    linkedInAds,
    setLinkedInAds,
    isCreating,
    setIsCreating
  };
};
