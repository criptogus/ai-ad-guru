import React, { createContext, useState, useContext, useEffect } from 'react';
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { AudienceAnalysisResult, AudienceCacheInfo } from "@/hooks/useAudienceAnalysis";

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
  audienceAnalysis?: AudienceAnalysisResult; // Added audience analysis field
  audienceCacheInfo?: AudienceCacheInfo; // Added audience cache info field
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
  audienceAnalysisResult: AudienceAnalysisResult | null; // Added audience analysis result
  setAudienceAnalysisResult: React.Dispatch<React.SetStateAction<AudienceAnalysisResult | null>>; // Added setter
  audienceCacheInfo: AudienceCacheInfo | null; // Added audience cache info
  setAudienceCacheInfo: React.Dispatch<React.SetStateAction<AudienceCacheInfo | null>>; // Added setter
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
  const [audienceAnalysisResult, setAudienceAnalysisResult] = useState<AudienceAnalysisResult | null>(null);
  const [audienceCacheInfo, setAudienceCacheInfo] = useState<AudienceCacheInfo | null>(null);

  // Make the campaign context available globally for direct access
  useEffect(() => {
    const contextValue = {
      currentStep,
      campaignData,
      analysisResult,
      googleAds,
      metaAds,
      linkedInAds,
      microsoftAds,
      audienceAnalysisResult,
      audienceCacheInfo
    };
    
    // Add the context to the window object for global access
    (window as any).campaignContext = contextValue;
    
    // Clean up when the component unmounts
    return () => {
      delete (window as any).campaignContext;
    };
  }, [currentStep, campaignData, analysisResult, googleAds, metaAds, linkedInAds, microsoftAds, audienceAnalysisResult, audienceCacheInfo]);

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
        audienceAnalysisResult,
        setAudienceAnalysisResult,
        audienceCacheInfo,
        setAudienceCacheInfo
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
