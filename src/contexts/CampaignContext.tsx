
import React, { createContext, useContext, useState, ReactNode } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd } from "@/hooks/useAdGeneration";

// Define new ad types for LinkedIn and Microsoft
export interface LinkedInAd {
  headline: string;
  description: string;
  imagePrompt?: string;
  imageUrl?: string;
}

export interface MicrosoftAd {
  headlines: string[];
  descriptions: string[];
}

export interface CampaignData {
  name: string;
  platform: "google" | "linkedin" | "microsoft";
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
  linkedInAds: LinkedInAd[];
  microsoftAds: MicrosoftAd[];
}

interface CampaignContextType {
  campaignData: CampaignData;
  setCampaignData: React.Dispatch<React.SetStateAction<CampaignData>>;
  analysisResult: WebsiteAnalysisResult | null;
  setAnalysisResult: React.Dispatch<React.SetStateAction<WebsiteAnalysisResult | null>>;
  updateAnalysisResult: (updatedResult: WebsiteAnalysisResult) => void;
  googleAds: GoogleAd[];
  setGoogleAds: React.Dispatch<React.SetStateAction<GoogleAd[]>>;
  linkedInAds: LinkedInAd[];
  setLinkedInAds: React.Dispatch<React.SetStateAction<LinkedInAd[]>>;
  microsoftAds: MicrosoftAd[];
  setMicrosoftAds: React.Dispatch<React.SetStateAction<MicrosoftAd[]>>;
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
    linkedInAds: [],
    microsoftAds: [],
  });
  
  const [analysisResult, setAnalysisResult] = useState<WebsiteAnalysisResult | null>(null);
  const [googleAds, setGoogleAds] = useState<GoogleAd[]>([]);
  const [linkedInAds, setLinkedInAds] = useState<LinkedInAd[]>([]);
  const [microsoftAds, setMicrosoftAds] = useState<MicrosoftAd[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  // Function to update analysis result and also update the campaign data
  const updateAnalysisResult = (updatedResult: WebsiteAnalysisResult) => {
    setAnalysisResult(updatedResult);
    setCampaignData(prev => ({
      ...prev,
      businessInfo: updatedResult,
      targetAudience: updatedResult.targetAudience,
      description: updatedResult.businessDescription
    }));
  };

  return (
    <CampaignContext.Provider value={{
      campaignData,
      setCampaignData,
      analysisResult,
      setAnalysisResult,
      updateAnalysisResult,
      googleAds,
      setGoogleAds,
      linkedInAds,
      setLinkedInAds,
      microsoftAds,
      setMicrosoftAds,
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
