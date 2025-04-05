
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { getDomain } from "@/lib/utils";
import MicrosoftAdCard from "./MicrosoftAdCard";

interface MicrosoftAdsListProps {
  ads: GoogleAd[];
  domain: string;
  onUpdateAd: (index: number, updatedAd: GoogleAd) => void;
}

const MicrosoftAdsList: React.FC<MicrosoftAdsListProps> = ({
  ads,
  domain,
  onUpdateAd
}) => {
  return (
    <div className="space-y-4">
      {ads.map((ad, index) => (
        <MicrosoftAdCard
          key={`microsoft-ad-${index}`}
          ad={ad}
          index={index}
          domain={domain}
          onUpdate={(updatedAd) => onUpdateAd(index, updatedAd)}
        />
      ))}
    </div>
  );
};

export default MicrosoftAdsList;
