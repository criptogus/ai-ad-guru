
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { HelpCircle, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ConnectionErrorDisplayProps {
  error: string | null;
  errorDetails: string | null;
  errorType: string | null;
}

const ConnectionErrorDisplay: React.FC<ConnectionErrorDisplayProps> = ({
  error,
  errorDetails,
  errorType
}) => {
  if (!error) return null;
  
  // Determine if we have a LinkedIn-specific error
  const isLinkedInError = errorType === 'linkedin' || 
    (errorDetails && errorDetails.toLowerCase().includes('linkedin'));

  return (
    <Alert variant="destructive" className="mb-6">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Connection Error</AlertTitle>
      <AlertDescription>
        {error}
        {errorDetails && (
          <div className="mt-2">
            <details className="group">
              <summary className="cursor-pointer font-medium flex items-center gap-1 text-sm">
                <span className="underline-offset-4 group-hover:underline">Details</span>
              </summary>
              <p className="mt-2 text-sm font-mono bg-destructive/10 p-3 rounded">{errorDetails}</p>
            </details>
          </div>
        )}
        
        {isLinkedInError && (
          <div className="mt-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="linkedin-help">
                <AccordionTrigger className="text-sm">
                  <div className="flex items-center gap-1">
                    <HelpCircle className="h-4 w-4" />
                    <span>LinkedIn Connection Help</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <p>LinkedIn requires special approval for marketing API access:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Go to <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">LinkedIn Developer Portal</a></li>
                      <li>Select your app</li>
                      <li>Under "Products", request "Marketing Developer Platform" access</li>
                      <li>Make sure your Redirect URI is <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">https://auth.zeroagency.ai/auth/v1/callback</code></li>
                      <li>Wait for LinkedIn approval (can take 1-5 business days)</li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {errorType === 'google' && errorDetails && errorDetails.toLowerCase().includes('redirect') && (
          <div className="mt-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="google-help">
                <AccordionTrigger className="text-sm">
                  <div className="flex items-center gap-1">
                    <HelpCircle className="h-4 w-4" />
                    <span>Google OAuth Configuration Help</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <p>Google requires exact redirect URI configuration:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Cloud Console</a></li>
                      <li>Select your OAuth 2.0 Client ID</li>
                      <li>Under "Authorized redirect URIs", add <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">https://auth.zeroagency.ai/auth/v1/callback</code></li>
                      <li>Save your changes</li>
                      <li>Make sure the Google Ads API is enabled in your project</li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionErrorDisplay;
