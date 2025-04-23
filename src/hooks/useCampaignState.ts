
import { useState } from 'react';
import { GoogleAd, MetaAd } from '@/hooks/adGeneration/types';

// Define a more comprehensive interface for campaign data
export interface CampaignData {
  name: string;
  description: string;
  platforms: string[];
  mindTriggers: Record<string, string>;
  targetUrl?: string;
  companyName: string; // Make companyName required
  budget?: number;
  budgetType?: 'daily' | 'lifetime';
  startDate?: string;
  endDate?: string;
  objective?: string;
  targetAudience?: string;
  keywords?: string[];
  websiteUrl?: string;
  country?: string;
  language?: string;
  optimizationFrequency?: string;
  product?: string;
  brandTone?: string; 
  industry?: string;
}

export const useCampaignState = () => {
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: '',
    description: '',
    platforms: [] as string[],
    mindTriggers: {} as Record<string, string>,
    companyName: '', // Initialize companyName
    language: 'en', // Default to English
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
