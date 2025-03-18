
import React, { createContext, useContext, useState, ReactNode } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/useAdGeneration";

interface CampaignData {
  name: string;
  platform: "google" | "meta";
  budget: number;
  budgetType: string;
  startDate: string;
  endDate: string;
  objective: string;
  targetAudience: string;
  description: string;
  websiteUrl: string;
  businessInfo: WebsiteAnalysisResult | null;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
}

interface CampaignContextType {
  campaignData: CampaignData;
  setCampaignData: React.Dispatch<React.SetStateAction<CampaignData>>;
  analysisResult: WebsiteAnalysisResult | null;
  setAnalysisResult: React.Dispatch<React.SetStateAction<WebsiteAnalysisResult | null>>;
  googleAds: GoogleAd[];
  setGoogleAds: React.Dispatch<React.SetStateAction<GoogleAd[]>>;
  metaAds: MetaAd[];
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    platform: "google",
    budget: 50,
    budgetType: "daily",
    startDate: "",
    endDate: "",
    objective: "traffic",
    targetAudience: "",
    description: "",
    websiteUrl: "",
    businessInfo: null,
    googleAds: [],
    metaAds: [],
  });
  
  const [analysisResult, setAnalysisResult] = useState<WebsiteAnalysisResult | null>(null);
  const [googleAds, setGoogleAds] = useState<GoogleAd[]>([]);
  const [metaAds, setMetaAds] = useState<MetaAd[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <CampaignContext.Provider value={{
      campaignData,
      setCampaignData,
      analysisResult,
      setAnalysisResult,
      googleAds,
      setGoogleAds,
      metaAds,
      setMetaAds,
      currentStep,
      setCurrentStep
    }}>
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
