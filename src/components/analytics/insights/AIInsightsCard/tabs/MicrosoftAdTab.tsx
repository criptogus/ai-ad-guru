import React from 'react';
import { BaseAdTab } from './BaseAdTab';

export const MicrosoftAdTab: React.FC = () => {
  const suggestions = [
    'Target business professionals by mentioning ROI',
    'Add business-focused keywords that Microsoft Ads users respond to'
  ];

  const microsoftAdPreview = (
    <>
      <div className="text-sm text-blue-600 mb-1">yourdomain.com</div>
      <div className="text-base font-medium mb-1">Your Microsoft Ads Headline</div>
      <div className="text-sm text-gray-700 mb-2">
        Your professional description targeting business audiences.
      </div>
    </>
  );

  return (
    <BaseAdTab 
      adPreview={microsoftAdPreview}
      suggestions={suggestions}
      platform="Microsoft"
    />
  );
};
