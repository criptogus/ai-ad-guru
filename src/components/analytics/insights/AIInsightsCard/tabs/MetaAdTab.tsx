
import React from "react";
import { InstagramPreview } from "@/components/campaign/ad-preview/meta";
import { AIInsightsSuggestions } from "../AIInsightsSuggestions";
import { AdActions } from "../AdActions";
import { MetaAd } from "@/hooks/adGeneration";
import { useToast } from "@/hooks/use-toast";

interface MetaAdTabProps {
  ad: MetaAd;
}

export const MetaAdTab: React.FC<MetaAdTabProps> = ({ ad }) => {
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
      text: "Use more emotional language in primary text to boost engagement"
    },
    {
      id: 2,
      text: "Add user testimonial for social proof (e.g., \"Our clients saw 35% better results\")"
    }
  ];

  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="border rounded-md p-2 bg-white">
        <InstagramPreview ad={ad} companyName="Your Company" />
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
