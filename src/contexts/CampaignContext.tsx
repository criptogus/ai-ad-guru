import React, { createContext, useState, useContext } from 'react';
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

export type LinkedInAd = MetaAd;
export type MicrosoftAd = GoogleAd;

export interface CampaignContextType {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  campaignData: any;
  setCampaignData: React.Dispatch<React.SetStateAction<any>>;
  analysisResult: WebsiteAnalysisResult | null;
  setAnalysisResult: React.Dispatch<React.SetStateAction<WebsiteAnalysisResult | null>>;
  googleAds: GoogleAd[];
  setGoogleAds: React.Dispatch<React.SetStateAction<GoogleAd[]>>;
  linkedInAds: LinkedInAd[];
  setLinkedInAds: React.Dispatch<React.SetStateAction<LinkedInAd[]>>;
  microsoftAds: MicrosoftAd[];
  setMicrosoftAds: React.Dispatch<React.SetStateAction<MicrosoftAd[]>>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState<any>({});
  const [analysisResult, setAnalysisResult] = useState<WebsiteAnalysisResult | null>(null);
  const [googleAds, setGoogleAds] = useState<GoogleAd[]>([]);
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
        linkedInAds,
        setLinkedInAds,
        microsoftAds,
        setMicrosoftAds
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = (): CampaignContextType => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error("useCampaign must be used within a CampaignProvider");
  }
  return context;
};
