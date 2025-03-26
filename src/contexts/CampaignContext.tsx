
import React, { createContext, useState, useContext } from 'react';
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

export type LinkedInAd = MetaAd;
export type MicrosoftAd = GoogleAd;

export interface CampaignData {
  name?: string;
  description?: string;
  platform?: string;
  platforms?: string[]; // Array for multiple platform selection
  websiteUrl?: string;
  targetAudience?: string;
  googleAds?: GoogleAd[];
  metaAds?: MetaAd[];
  linkedInAds?: LinkedInAd[];
  microsoftAds?: MicrosoftAd[];
  mindTriggers?: Record<string, string>; // Platform to mind trigger mapping
  [key: string]: any;
}

export interface CampaignContextType {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  campaignData: CampaignData;
  setCampaignData: React.Dispatch<React.SetStateAction<CampaignData>>;
  analysisResult: WebsiteAnalysisResult | null;
  setAnalysisResult: React.Dispatch<React.SetStateAction<WebsiteAnalysisResult | null>>;
  googleAds: GoogleAd[];
  setGoogleAds: React.Dispatch<React.SetStateAction<GoogleAd[]>>;
  linkedInAds: LinkedInAd[];
  setLinkedInAds: React.Dispatch<React.SetStateAction<LinkedInAd[]>>;
  microsoftAds: MicrosoftAd[];
  setMicrosoftAds: React.Dispatch<React.SetStateAction<MicrosoftAd[]>>;
  metaAds: MetaAd[]; 
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    platforms: [],
    name: "",
    description: "",
    targetAudience: "",
    mindTriggers: {},
  });
  const [analysisResult, setAnalysisResult] = useState<WebsiteAnalysisResult | null>(null);
  const [googleAds, setGoogleAds] = useState<GoogleAd[]>([]);
  const [metaAds, setMetaAds] = useState<MetaAd[]>([]);
  const [linkedInAds, setLinkedInAds] = useState<LinkedInAd[]>([]);
  const [microsoftAds, setMicrosoftAds] = useState<MicrosoftAd[]>([]);

  return (
    <CampaignContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        campaignData,
        setCampaignData,
        analysisResult,
        setAnalysisResult,
        googleAds,
        setGoogleAds,
        metaAds,
        setMetaAds,
        linkedInAds,
        setLinkedInAds,
        microsoftAds,
        setMicrosoftAds,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error("useCampaign must be used within a CampaignProvider");
  }
  return context;
};
