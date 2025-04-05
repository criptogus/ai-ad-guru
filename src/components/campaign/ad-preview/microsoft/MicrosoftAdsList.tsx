
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { MicrosoftAd } from "@/hooks/adGeneration/types";
import MicrosoftAdCard from "./MicrosoftAdCard";

interface MicrosoftAdsListProps {
  ads: MicrosoftAd[];
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
  // Extract domain from website URL
  const getDomain = (url: string) => {
    try {
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  const domain = getDomain(websiteUrl);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Generated Microsoft Ads</h3>
        <Button 
          onClick={onGenerateAds} 
          disabled={isGenerating}
          variant="outline"
          size="sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>Regenerate Ads</>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {ads.map((ad, index) => (
          <MicrosoftAdCard
            key={index}
            ad={ad}
            domain={domain}
            index={index}
            onUpdate={(updatedAd) => onUpdateAd(index, updatedAd)}
          />
        ))}
      </div>
    </div>
  );
};

export default MicrosoftAdsList;
