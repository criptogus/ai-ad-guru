
import { useState } from 'react';
import { GoogleAd, MetaAd } from '@/hooks/adGeneration/types';

export const useCampaignState = () => {
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
    platforms: [] as string[],
    mindTriggers: {} as Record<string, string>
  });
  
  const [googleAds, setGoogleAds] = useState<GoogleAd[]>([]);
  const [metaAds, setMetaAds] = useState<MetaAd[]>([]);
  const [microsoftAds, setMicrosoftAds] = useState<GoogleAd[]>([]);
  const [linkedInAds, setLinkedInAds] = useState<MetaAd[]>([]);
  
  return {
    campaignData,
    setCampaignData,
    googleAds,
    setGoogleAds,
    metaAds,
    setMetaAds,
    microsoftAds,
    setMicrosoftAds,
    linkedInAds,
    setLinkedInAds
  };
};
