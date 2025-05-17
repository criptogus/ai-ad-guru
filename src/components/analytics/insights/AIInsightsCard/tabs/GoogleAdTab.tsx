import React from 'react';
import { BaseAdTab } from './BaseAdTab';

interface GoogleAdTabProps {
  sitelinks: Array<{ title: string; link: string }>;
}

export const GoogleAdTab: React.FC<GoogleAdTabProps> = ({ sitelinks }) => {
  const suggestions = [
    'Add specific numbers to headline for better CTR',
    'Include a stronger call-to-action in description'
  ];

  const googleAdPreview = (
    <>
      <div className="text-sm text-blue-600 mb-1">yourdomain.com</div>
      <div className="text-base font-medium mb-1">Your Compelling Ad Headline</div>
      <div className="text-sm text-gray-700 mb-2">
        Your engaging description text that converts visitors into customers.
      </div>
      <div className="flex flex-wrap gap-2">
        {sitelinks.map((link, i) => (
          <div key={i} className="text-xs text-blue-600">
            {link.title} •
          </div>
        ))}
      </div>
    </>
  );

  return (
    <BaseAdTab 
      adPreview={googleAdPreview}
      suggestions={suggestions}
      platform="Google"
    />
  );
};
