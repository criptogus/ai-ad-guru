
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { MicrosoftAd } from "@/hooks/adGeneration/types";
import { getDomain } from "@/lib/utils";
import MicrosoftAdsList from "./MicrosoftAdsList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface MicrosoftAdsTabProps {
  microsoftAds: MicrosoftAd[];
  websiteUrl?: string;
  analysisResult?: WebsiteAnalysisResult;
  isGenerating: boolean;
  onGenerateAds: () => Promise<void>;
  onUpdateMicrosoftAd: (index: number, updatedAd: MicrosoftAd) => void;
  mindTrigger?: string;
}

const MicrosoftAdsTab: React.FC<MicrosoftAdsTabProps> = ({
  microsoftAds,
  websiteUrl = "",
  analysisResult,
  isGenerating,
  onGenerateAds,
  onUpdateMicrosoftAd,
  mindTrigger
}) => {
  const domain = getDomain(websiteUrl || (analysisResult?.websiteUrl || ""));
  
  return (
    <div>
      {mindTrigger && (
        <Alert className="mb-4">
          <AlertTitle>Active Mind Trigger</AlertTitle>
          <AlertDescription>{mindTrigger}</AlertDescription>
        </Alert>
      )}

      {microsoftAds.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
            Generate Microsoft ads based on your website content and mind triggers. Our AI will create optimized ad copy for Microsoft Advertising.
          </p>
          <Button 
            onClick={onGenerateAds} 
            disabled={isGenerating}
            className="min-w-[200px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Ads...
              </>
            ) : (
              <>Generate Microsoft Ads</>
            )}
          </Button>
        </div>
      ) : (
        <MicrosoftAdsList
          ads={microsoftAds}
          websiteUrl={websiteUrl || (analysisResult?.websiteUrl || "")}
          isGenerating={isGenerating}
          onGenerateAds={onGenerateAds}
          onUpdateAd={onUpdateMicrosoftAd}
        />
      )}
    </div>
  );
};

export default MicrosoftAdsTab;
