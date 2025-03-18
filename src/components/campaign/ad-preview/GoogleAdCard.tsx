
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GoogleAd } from "@/hooks/useAdGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface GoogleAdCardProps {
  ad: GoogleAd;
  index: number;
  analysisResult: WebsiteAnalysisResult;
}

const GoogleAdCard: React.FC<GoogleAdCardProps> = ({ ad, index, analysisResult }) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "The text has been copied to your clipboard",
      duration: 2000,
    });
  };

  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">Google Ad Variation {index + 1}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => copyToClipboard(`${ad.headlines.join(" | ")}\n\n${ad.descriptions.join("\n")}`)}
        >
          <Copy size={16} className="mr-1" /> Copy
        </Button>
      </div>
      
      {/* Google Ad Preview */}
      <div className="bg-gray-50 p-3 rounded-md mb-3">
        <div className="text-xs text-gray-500 mb-1">www.{analysisResult.companyName.toLowerCase().replace(/\s+/g, "-")}.com</div>
        <div className="text-blue-800 font-medium text-xl leading-tight">
          {ad.headlines.map((headline, i) => (
            <span key={i}>
              {headline}
              {i < ad.headlines.length - 1 && <span className="text-gray-400"> | </span>}
            </span>
          ))}
        </div>
        <div className="text-gray-600 text-sm mt-1">
          {ad.descriptions.map((desc, i) => (
            <div key={i}>{desc}</div>
          ))}
        </div>
      </div>
      
      {/* Ad Details */}
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Headlines:</span>
          <ul className="list-disc list-inside pl-2">
            {ad.headlines.map((headline, i) => (
              <li key={i}>{headline}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className="font-medium">Descriptions:</span>
          <ul className="list-disc list-inside pl-2">
            {ad.descriptions.map((desc, i) => (
              <li key={i}>{desc}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GoogleAdCard;
