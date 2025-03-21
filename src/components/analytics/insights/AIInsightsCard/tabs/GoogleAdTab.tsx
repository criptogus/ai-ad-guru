
import React from "react";
import { GoogleAdPreview } from "@/components/campaign/ad-preview/google";
import { AIInsightsSuggestions } from "../AIInsightsSuggestions";
import { AdActions } from "../AdActions";
import { GoogleAd } from "@/hooks/adGeneration";
import { useToast } from "@/hooks/use-toast";

interface GoogleAdTabProps {
  ad: GoogleAd;
}

export const GoogleAdTab: React.FC<GoogleAdTabProps> = ({ ad }) => {
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
      text: "Add specific numbers to headline for better CTR (e.g., \"Boost Performance by 40%\")"
    },
    {
      id: 2,
      text: "Include a stronger call-to-action in description"
    }
  ];

  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="border rounded-md p-2 bg-white">
        <GoogleAdPreview ad={ad} domain="yourdomain.com" />
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
