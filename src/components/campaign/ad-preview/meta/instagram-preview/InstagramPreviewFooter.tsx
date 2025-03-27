
import React from "react";
import { Button } from "@/components/ui/button";
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
    <div className="mt-2">
      <div className="text-xs text-gray-500 my-1">
        {Math.floor(Math.random() * 1000) + 100} likes
      </div>
      
      {ad.hashtags && ad.hashtags.length > 0 && (
        <p className="text-xs text-blue-600 mt-1">
          {ad.hashtags.map(tag => `#${tag}`).join(' ')}
        </p>
      )}
      
      <div className="mt-2 space-y-1">
        <p className="text-xs text-gray-500">View all {Math.floor(Math.random() * 50) + 5} comments</p>
        <p className="text-xs text-gray-400">{Math.floor(Math.random() * 10) + 1} DAYS AGO</p>
      </div>
      
      <div className="mt-2 pt-2 border-t">
        <Button 
          variant="default" 
          size="sm" 
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {ad.description || "Learn More"}
        </Button>
      </div>
    </div>
  );
};

export default InstagramPreviewFooter;
