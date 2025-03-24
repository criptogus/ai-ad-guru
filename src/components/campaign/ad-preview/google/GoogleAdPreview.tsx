
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";

interface GoogleAdPreviewProps {
  ad: GoogleAd;
  domain: string;
}

const GoogleAdPreview: React.FC<GoogleAdPreviewProps> = ({ ad, domain }) => {
  return (
    <div className="max-w-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3 font-sans">
      <div className="flex items-center mb-0.5">
        <span className="text-[10px] px-1 mr-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">Ad</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{domain} ·</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">Sponsored</span>
      </div>
      
      <div className="text-green-700 dark:text-green-500 text-xs mb-1">
        www.{domain}
      </div>
      
      <div className="text-blue-800 dark:text-blue-400 text-xl font-medium leading-tight">
        {ad.headlines.map((headline, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="mx-1 text-gray-400">|</span>}
            <span>{headline}</span>
          </React.Fragment>
        ))}
      </div>
      
      <div className="text-gray-700 dark:text-gray-300 mt-1 text-sm leading-snug">
        {ad.descriptions.map((description, i) => (
          <div key={i}>{description}</div>
        ))}
      </div>
      
      <div className="mt-2 flex flex-wrap items-center gap-1">
        <div className="text-xs py-0.5 px-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300">
          Features
        </div>
        <div className="text-xs py-0.5 px-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300">
          Benefits
        </div>
        <div className="text-xs py-0.5 px-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300">
          Services
        </div>
      </div>
    </div>
  );
};

export default GoogleAdPreview;
