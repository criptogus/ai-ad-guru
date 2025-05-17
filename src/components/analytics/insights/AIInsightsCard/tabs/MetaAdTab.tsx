import React from 'react';
import { BaseAdTab } from './BaseAdTab';

export const MetaAdTab: React.FC = () => {
  const suggestions = [
    'Use more emotional language in your caption',
    'Add a testimonial for social proof'
  ];

  const metaAdPreview = (
    <>
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
    </>
  );

  return (
    <BaseAdTab 
      adPreview={metaAdPreview}
      suggestions={suggestions}
      platform="Meta"
    />
  );
};
