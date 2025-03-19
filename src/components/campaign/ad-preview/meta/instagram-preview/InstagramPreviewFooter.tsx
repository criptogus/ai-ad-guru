
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";

interface InstagramPreviewFooterProps {
  ad: MetaAd;
  companyName: string;
}

const InstagramPreviewFooter: React.FC<InstagramPreviewFooterProps> = ({
  ad,
  companyName
}) => {
  return (
    <div className="bg-white p-3">
      <div className="flex items-center space-x-4 mb-2 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 8.7-8.7a.97.97 0 0 1 1.41 0l6.89 6.89" /><path d="M13 13.8 21 21" /><path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
      </div>
      
      <div>
        <span className="font-semibold text-sm">{companyName}</span>
        <span className="text-sm"> {ad.primaryText}</span>
      </div>
      
      <div className="mt-1 text-sm">
        <span className="font-semibold">{ad.headline}</span>
        <span className="text-gray-500"> {ad.description}</span>
      </div>
      
      <div className="mt-2">
        <button className="w-full py-1.5 rounded bg-[#0095f6] text-white font-semibold text-sm">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default InstagramPreviewFooter;
