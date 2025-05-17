import React from 'react';

// Interface base para todos os componentes de abas de anúncios
export interface BaseAdTabProps {
  suggestions?: string[];
  sitelinks?: Array<{title: string, link: string}>;
}

// Componente base para as abas de anúncios
export const BaseAdTab: React.FC<BaseAdTabProps & {
  adPreview: React.ReactNode;
  platform: string;
}> = ({ adPreview, suggestions = [], platform }) => {
  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="border rounded-md p-2 bg-white">
        {adPreview}
      </div>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
          <h4 className="text-sm font-medium text-blue-800">Suggestions</h4>
          <ul className="mt-2 space-y-2 text-xs">
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
