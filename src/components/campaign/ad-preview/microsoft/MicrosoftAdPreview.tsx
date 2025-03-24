
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface MicrosoftAdPreviewProps {
  ad: GoogleAd;
  analysisResult?: WebsiteAnalysisResult;
  domain?: string;
}

const MicrosoftAdPreview: React.FC<MicrosoftAdPreviewProps> = ({ ad, analysisResult, domain }) => {
  // Use domain if provided, otherwise extract from analysisResult
  const displayDomain = domain || (analysisResult ? getUrlFromCompanyName(analysisResult.companyName) : "example.com");
  
  return (
    <div className="border rounded-md p-3 bg-white dark:bg-gray-800 shadow-sm text-sm w-full">
      {/* Microsoft branding */}
      <div className="flex items-center mb-1">
        <span className="text-[10px] px-1 mr-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">Ad</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">·</span>
        <span className="text-xs text-blue-700 dark:text-blue-400">Microsoft Advertising</span>
      </div>
      
      {/* Ad URL */}
      <div className="text-green-700 dark:text-green-500 truncate text-xs">
        www.{displayDomain}
      </div>
      
      {/* Ad Headlines */}
      <div className="font-medium text-blue-800 dark:text-blue-400 mt-1 text-xl leading-tight">
        {ad.headlines.map((headline, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="mx-1 text-gray-400">|</span>}
            <span>{headline}</span>
          </React.Fragment>
        ))}
      </div>
      
      {/* Ad Descriptions */}
      <div className="text-gray-700 dark:text-gray-300 mt-2 leading-tight">
        {ad.descriptions.map((description, i) => (
          <div key={i} className="mb-1">
            {description}
          </div>
        ))}
      </div>
      
      {/* Bing-specific Ad Extensions */}
      <div className="mt-3 flex flex-wrap">
        <span className="text-xs text-gray-500 dark:text-gray-400 mr-2 mb-1 border-r pr-2">
          4.8★ (56 reviews)
        </span>
        <span className="text-xs text-blue-700 dark:text-blue-400 mr-2 mb-1 border-r pr-2">
          Products
        </span>
        <span className="text-xs text-blue-700 dark:text-blue-400 mr-2 mb-1 border-r pr-2">
          Services
        </span>
        <span className="text-xs text-blue-700 dark:text-blue-400 mb-1">
          Contact Us
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

export default MicrosoftAdPreview;
