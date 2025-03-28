
import React from "react";
import { toast } from "@/hooks/use-toast";

export const MicrosoftAdTab: React.FC = () => {
  const createABTest = () => {
    toast({
      title: "A/B Test Created",
      description: "A duplicate of this ad has been created for A/B testing."
    });
  };

  const copyAdToClipboard = () => {
    toast({
      title: "Ad Copied",
      description: "Ad content has been copied to clipboard."
    });
  };

  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="border rounded-md p-2 bg-white">
        <div className="text-sm text-blue-600 mb-1">yourdomain.com</div>
        <div className="text-base font-medium mb-1">Your Microsoft Ads Headline</div>
        <div className="text-sm text-gray-700 mb-2">Your professional description targeting business audiences.</div>
      </div>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
          <h4 className="text-sm font-medium text-blue-800">Suggestions</h4>
          <ul className="mt-2 space-y-2 text-xs">
            <li>Target business professionals by mentioning ROI</li>
            <li>Add business-focused keywords that Microsoft Ads users respond to</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
