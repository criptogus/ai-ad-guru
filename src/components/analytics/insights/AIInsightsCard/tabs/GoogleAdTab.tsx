
import React from "react";
import { useToast } from "@/hooks/use-toast";

interface GoogleAdTabProps {
  sitelinks: Array<{title: string, link: string}>;
}

export const GoogleAdTab: React.FC<GoogleAdTabProps> = ({ sitelinks }) => {
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
        <div className="text-sm text-blue-600 mb-1">yourdomain.com</div>
        <div className="text-base font-medium mb-1">Your Compelling Ad Headline</div>
        <div className="text-sm text-gray-700 mb-2">Your engaging description text that converts visitors into customers.</div>
        <div className="flex flex-wrap gap-2">
          {sitelinks.map((link, i) => (
            <div key={i} className="text-xs text-blue-600">{link.title} •</div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
          <h4 className="text-sm font-medium text-blue-800">Suggestions</h4>
          <ul className="mt-2 space-y-2 text-xs">
            <li>Add specific numbers to headline for better CTR</li>
            <li>Include a stronger call-to-action in description</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
