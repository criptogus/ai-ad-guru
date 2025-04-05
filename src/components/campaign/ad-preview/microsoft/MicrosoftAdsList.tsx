
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MicrosoftAd } from "@/hooks/adGeneration/types";
import { getDomain } from "@/lib/utils";
import MicrosoftAdCard from "./MicrosoftAdCard";
import { Loader2, RefreshCw, Plus } from "lucide-react";

interface MicrosoftAdsListProps {
  ads: MicrosoftAd[] | null;
  websiteUrl: string; 
  isGenerating: boolean;
  onGenerateAds: () => Promise<void>;
  onUpdateAd: (index: number, updatedAd: MicrosoftAd) => void;
}

const MicrosoftAdsList: React.FC<MicrosoftAdsListProps> = ({
  ads,
  websiteUrl,
  isGenerating,
  onGenerateAds,
  onUpdateAd
}) => {
  // Ensure ads is always an array
  const safeAds = Array.isArray(ads) ? ads : [];
  
  // Extract the domain from the website URL
  const domain = getDomain(websiteUrl);

  return (
    <div className="space-y-6">
      {/* Generate Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Microsoft Ads</h3>
          <p className="text-sm text-muted-foreground">
            Generate and customize Microsoft ads for your campaign
          </p>
        </div>
        
        <Button
          onClick={onGenerateAds}
          disabled={isGenerating}
          variant={safeAds.length > 0 ? "outline" : "default"}
          className="ml-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : safeAds.length > 0 ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate Ads
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Generate Ads
            </>
          )}
        </Button>
      </div>

      {/* Show loading state */}
      {isGenerating && safeAds.length === 0 && (
        <Card>
          <CardContent className="py-10 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">
              Generating Microsoft ads using AI...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Show empty state */}
      {!isGenerating && safeAds.length === 0 && (
        <Card>
          <CardContent className="py-10 flex flex-col items-center justify-center">
            <p className="text-muted-foreground mb-4">
              No Microsoft ads generated yet
            </p>
            <Button onClick={onGenerateAds} disabled={isGenerating}>
              Generate Microsoft Ads
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Show ads */}
      {safeAds.length > 0 && (
        <div className="space-y-6">
          {safeAds.map((ad, index) => (
            <MicrosoftAdCard
              key={index}
              ad={ad}
              domain={domain}
              index={index}
              onUpdateAd={(updatedAd) => onUpdateAd(index, updatedAd)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MicrosoftAdsList;
