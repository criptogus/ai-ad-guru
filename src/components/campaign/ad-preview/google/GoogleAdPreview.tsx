
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface GoogleAdPreviewProps {
  ad: GoogleAd;
  analysisResult: WebsiteAnalysisResult;
}

const GoogleAdPreview: React.FC<GoogleAdPreviewProps> = ({ ad, analysisResult }) => {
  return (
    <div className="border rounded-md p-3 bg-white shadow-sm text-sm w-full max-w-md">
      {/* Ad URL */}
      <div className="text-green-700 truncate text-xs">
        www.{getUrlFromCompanyName(analysisResult.companyName)}
      </div>
      
      {/* Ad Headlines */}
      <div className="font-medium text-blue-800 mt-1 text-xl leading-tight">
        {ad.headlines.map((headline, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="mx-1 text-gray-400">|</span>}
            <span>{headline}</span>
          </React.Fragment>
        ))}
      </div>
      
      {/* Ad Descriptions */}
      <div className="text-gray-600 mt-2 leading-tight">
        {ad.descriptions.map((description, i) => (
          <div key={i} className="mb-1">
            {description}
            <span className="text-xs ml-1 text-gray-400">({description.length}/90)</span>
          </div>
        ))}
      </div>
      
      {/* Ad Extensions */}
      <div className="mt-3 flex flex-wrap">
        <span className="text-xs text-gray-500 mr-2 mb-1 border-r pr-2">
          Rating: ★★★★★
        </span>
        <span className="text-xs text-blue-700 mr-2 mb-1 border-r pr-2">
          Contact
        </span>
        <span className="text-xs text-blue-700 mr-2 mb-1 border-r pr-2">
          Services
        </span>
        <span className="text-xs text-blue-700 mb-1">
          About
        </span>
      </div>
    </div>
  );
};

// Helper function to create a URL from company name
const getUrlFromCompanyName = (companyName: string): string => {
  return companyName
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9-]/g, '') + '.com';
};

export default GoogleAdPreview;
