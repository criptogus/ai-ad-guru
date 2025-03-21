
import React from "react";
import { MicrosoftAdPreview } from "@/components/campaign/ad-preview/microsoft";
import { AIInsightsSuggestions } from "../AIInsightsSuggestions";
import { AdActions } from "../AdActions";
import { GoogleAd } from "@/hooks/adGeneration";
import { useToast } from "@/hooks/use-toast";

interface MicrosoftAdTabProps {
  ad: GoogleAd;
}

export const MicrosoftAdTab: React.FC<MicrosoftAdTabProps> = ({ ad }) => {
  const { toast } = useToast();

  const createABTest = () => {
    toast({
      title: "A/B Test Created",
      description: "A duplicate of this ad has been created for A/B testing.",
    });
  };

  const copyAdToClipboard = () => {
    toast({
      title: "Ad Copied",
      description: "Ad content has been copied to clipboard.",
    });
  };

  const suggestions = [
    {
      id: 1,
      text: "Target business professionals by mentioning ROI in headlines"
    },
    {
      id: 2,
      text: "Add business-focused keywords that Microsoft Ads users respond to"
    }
  ];

  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="border rounded-md p-2 bg-white">
        <MicrosoftAdPreview ad={ad} domain="yourdomain.com" />
      </div>
      <div className="space-y-4">
        <AIInsightsSuggestions suggestions={suggestions} />
        <AdActions 
          onCreateABTest={createABTest} 
          onCopyAd={copyAdToClipboard} 
        />
      </div>
    </div>
  );
};
