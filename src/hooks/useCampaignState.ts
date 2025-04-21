
import { useState } from "react";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration/types";

export interface CampaignData {
  name?: string;
  description?: string;
  targetUrl?: string;
  platforms?: string[];
  budget?: number;
  budgetType?: 'daily' | 'lifetime';
  startDate?: string;
  endDate?: string;
  objective?: string;
  targetAudience?: string;
  keywords?: string[];
  mindTriggers?: Record<string, string>;
}

export const useCampaignState = () => {
  const [campaignData, setCampaignData] = useState<CampaignData>({});
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
