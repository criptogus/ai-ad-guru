
import React from "react";
import { useToast } from "@/hooks/use-toast";

export const MetaAdTab: React.FC = () => {
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

  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="border rounded-md p-2 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
          <div className="text-sm font-medium">Your Company</div>
        </div>
        <div className="bg-gray-200 w-full h-40 rounded-md mb-2 flex items-center justify-center text-gray-500 text-sm">
          Instagram Ad Preview
        </div>
        <div className="text-sm mb-2">
          <span className="font-medium mr-1">yourcompany</span>
          Your engaging Instagram ad caption that drives engagement and conversions.
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
          <h4 className="text-sm font-medium text-blue-800">Suggestions</h4>
          <ul className="mt-2 space-y-2 text-xs">
            <li>Use more emotional language in your caption</li>
            <li>Add a testimonial for social proof</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
