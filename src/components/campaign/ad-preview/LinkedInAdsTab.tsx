
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MetaAd } from "@/hooks/adGeneration";
import EmptyAdsState from "./EmptyAdsState";
import LinkedInAdCard from "./linkedin/LinkedInAdCard";

interface LinkedInAdsTabProps {
  linkedInAds: MetaAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateAds: () => Promise<void>;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateLinkedInAd: (updatedAds: MetaAd[]) => void;
}

const LinkedInAdsTab: React.FC<LinkedInAdsTabProps> = ({
  linkedInAds,
  analysisResult,
  isGenerating,
  loadingImageIndex,
  onGenerateAds,
  onGenerateImage,
  onUpdateLinkedInAd,
}) => {
  const handleUpdateAd = (index: number, updatedAd: MetaAd) => {
    const updatedAds = [...linkedInAds];
    updatedAds[index] = updatedAd;
    onUpdateLinkedInAd(updatedAds);
  };

  if (!analysisResult) {
    return (
      <Card>
        <CardContent>
          Please analyze a website to generate ads.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {linkedInAds.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyAdsState platform="LinkedIn" />
            <Button 
              onClick={onGenerateAds} 
              className="mt-4 group relative overflow-hidden" 
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <span className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">Generate LinkedIn Ads</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {linkedInAds.map((ad, index) => (
            <LinkedInAdCard
              key={index}
              ad={ad}
              index={index}
              analysisResult={analysisResult}
              isGeneratingImage={loadingImageIndex === index}
              onGenerateImage={() => onGenerateImage(ad, index)}
              onUpdateAd={(updatedAd) => handleUpdateAd(index, updatedAd)}
            />
          ))}
          <Button onClick={onGenerateAds} disabled={isGenerating} className="mt-4">
            {isGenerating ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : "Generate More LinkedIn Ads"}
          </Button>
        </>
      )}
    </div>
  );
};

export default LinkedInAdsTab;
