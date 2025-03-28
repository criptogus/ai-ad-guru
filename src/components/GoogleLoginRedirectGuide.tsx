
import React from 'react';
import { 
  Alert, 
  AlertTitle, 
  AlertDescription 
} from '@/components/ui/alert';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ExternalLink } from 'lucide-react';

const GoogleLoginRedirectGuide: React.FC = () => {
  return (
    <Alert className="mt-4">
      <AlertTitle className="font-medium">Having trouble with Google Login?</AlertTitle>
      <AlertDescription>
        <p className="text-sm mt-1 mb-2">
          If you're seeing a "redirect_uri_mismatch" error, it means the Google OAuth configuration needs to be updated.
        </p>
        
        <Accordion type="single" collapsible>
          <AccordionItem value="solution">
            <AccordionTrigger className="text-sm font-medium">How to fix this issue</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal list-inside text-sm space-y-2 mt-2">
                <li>Go to the Google Cloud Console</li>
                <li>Select your project</li>
                <li>Go to "APIs & Services" > "Credentials"</li>
                <li>Edit your OAuth 2.0 Client ID</li>
                <li>Under "Authorized redirect URIs", add:
                  <code className="block bg-muted p-2 rounded mt-1 break-all">
                    {`${window.location.origin}/auth/v1/callback`}
                  </code>
                </li>
                <li>Also add your dashboard redirect URI:
                  <code className="block bg-muted p-2 rounded mt-1 break-all">
                    {`${window.location.origin}/dashboard`}
                  </code>
                </li>
                <li>Click "Save"</li>
              </ol>
              
              <p className="text-sm mt-3">
                <a 
                  href="https://supabase.com/docs/guides/auth/social-login/auth-google" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  Supabase Google Auth Guide
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </AlertDescription>
    </Alert>
  );
};

export default GoogleLoginRedirectGuide;
