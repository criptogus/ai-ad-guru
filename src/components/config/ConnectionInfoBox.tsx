
import React from 'react';
import { InfoIcon, ShieldCheck } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface ConnectionInfoBoxProps {
  hasError?: boolean;
}

const ConnectionInfoBox: React.FC<ConnectionInfoBoxProps> = ({ hasError }) => {
  return (
    <div className={`mt-4 p-4 rounded-md text-sm ${
      hasError ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300' : 
                'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
    }`}>
      <div className="flex items-start">
        {hasError ? (
          <InfoIcon className="h-5 w-5 mr-2 flex-shrink-0" />
        ) : (
          <ShieldCheck className="h-5 w-5 mr-2 flex-shrink-0" />
        )}
        <div>
          <p className="font-medium">
            {hasError ? 'Connection Troubleshooting' : 'Connection Security'}
          </p>
          <p className="mt-1">
            {hasError 
              ? 'If you encounter issues connecting your ad account, ensure you have admin access to the account and that you approve all required permissions.'
              : 'Your connection is secured with OAuth 2.0. We never store your passwords.'
            }
          </p>
          
          <div className="mt-2">
            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="text-xs underline">
                  {hasError ? 'View Common Issues' : 'Learn More About Security'}
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 text-xs">
                {hasError ? (
                  <div>
                    <h4 className="font-medium mb-1">Common Connection Issues:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Insufficient permissions on your ad account</li>
                      <li>Ad account has restrictions or is suspended</li>
                      <li>Browser cookie/cache issues (try incognito mode)</li>
                      <li>OAuth token exchange errors (retry connection)</li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-medium mb-1">Our Security Practices:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>All API tokens are securely encrypted at rest</li>
                      <li>OAuth 2.0 ensures no passwords are stored</li>
                      <li>Access can be revoked at any time</li>
                      <li>Regular security audits of all connections</li>
                    </ul>
                  </div>
                )}
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionInfoBox;
