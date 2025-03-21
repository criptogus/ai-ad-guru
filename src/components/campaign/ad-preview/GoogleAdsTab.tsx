import React, { useState } from "react";
import { Loader2, Plus, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import GoogleAdCard from "./GoogleAdCard";
import EmptyAdsState from "./EmptyAdsState";
import AdOptimizer from "./AdOptimizer";
import OptimizationResults from "./OptimizationResults";
import { OptimizedGoogleAd } from "@/services/api/optimizerApi";
import { useAuth } from "@/contexts/AuthContext";

interface GoogleAdsTabProps {
  googleAds: GoogleAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  onGenerateGoogleAds: () => Promise<void>;
  onUpdateAd?: (index: number, updatedAd: GoogleAd) => void;
  onApplyOptimization?: (index: number, optimizedAd: OptimizedGoogleAd) => void;
}

const GoogleAdsTab: React.FC<GoogleAdsTabProps> = ({
  googleAds,
  analysisResult,
  isGenerating,
  onGenerateGoogleAds,
  onUpdateAd,
  onApplyOptimization
}) => {
  const [optimizedAds, setOptimizedAds] = useState<OptimizedGoogleAd[] | null>(null);
  const { user } = useAuth();
  
  const handleOptimizerResults = (results: OptimizedGoogleAd[]) => {
    setOptimizedAds(results);
  };
  
  const handleApplyOptimization = (originalIndex: number, optimizedAd: OptimizedGoogleAd) => {
    if (onApplyOptimization) {
      onApplyOptimization(originalIndex, optimizedAd);
    } else if (onUpdateAd) {
      // Fallback to standard update if optimization-specific handler isn't available
      onUpdateAd(originalIndex, {
        ...googleAds[originalIndex],
        headlines: optimizedAd.headlines,
        descriptions: optimizedAd.descriptions
      });
    }
  };
  
  const dismissOptimizationResults = () => {
    setOptimizedAds(null);
  };

  // If we have no ads, show the empty state with generation button
  if (googleAds.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyAdsState 
          title="No Google Ads Created Yet"
          description="Generate AI-powered Google Search Ads based on your website analysis"
          buttonText="Generate Google Ads"
          isLoading={isGenerating}
          onClick={onGenerateGoogleAds}
          icon={<PlusCircle className="h-8 w-8 text-blue-500 mb-1" />}
        />
      </div>
    );
  }

  // If we have optimization results, show them
  if (optimizedAds) {
    return (
      <OptimizationResults
        adType="google"
        originalAds={googleAds}
        optimizedAds={optimizedAds}
        onApplyOptimization={handleApplyOptimization}
        onDismiss={dismissOptimizationResults}
      />
    );
  }

  // Otherwise, show the ads with optimizer sidebar
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Google Search Ads ({googleAds.length})</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onGenerateGoogleAds}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Generate More
              </>
            )}
          </Button>
        </div>
        
        <div className="space-y-4">
          {googleAds.map((ad, index) => (
            <GoogleAdCard
              key={index}
              ad={ad}
              index={index}
              analysisResult={analysisResult}
              onUpdate={onUpdateAd ? (updatedAd) => onUpdateAd(index, updatedAd) : undefined}
            />
          ))}
        </div>
      </div>
      
      <div>
        <AdOptimizer
          adType="google"
          ads={googleAds}
          onOptimizedAdsGenerated={handleOptimizerResults}
          credits={user?.credits}
        />
      </div>
    </div>
  );
};

export default GoogleAdsTab;
