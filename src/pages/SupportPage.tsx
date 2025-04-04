
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ConnectionDiagnostics from '@/components/support/ConnectionDiagnostics';
import AppLayout from '@/components/AppLayout';

const SupportPage: React.FC = () => {
  return (
    <AppLayout activePage="support" withSidebar={true}>
      <Helmet>
        <title>Support | ZeroAgency AI</title>
      </Helmet>

      <div className="container py-6">
        <PageHeader
          title="Support"
          description="Get help and troubleshooting for your AI ad campaigns"
        />

        <div className="grid gap-6 mt-6">
          <ConnectionDiagnostics />
        
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions and solutions to issues you might encounter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    I'm having trouble connecting my Google Ads account
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      This typically happens due to one of the following reasons:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Your Google account doesn't have access to a Google Ads account</li>
                      <li>You haven't granted the necessary permissions during the OAuth flow</li>
                      <li>The Google Developer Token is invalid or restricted</li>
                      <li>The OAuth redirect URI is misconfigured</li>
                    </ul>
                    <p className="mt-2">
                      Try reconnecting your account and ensure you're selecting the correct Google account that has Google Ads access.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    My LinkedIn Ads connection is failing
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      LinkedIn Ad connections can fail because:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Your LinkedIn developer application needs Marketing Developer Platform approval</li>
                      <li>The required scopes haven't been approved for your app</li>
                      <li>The redirect URI doesn't match what's configured in the LinkedIn Developer portal</li>
                      <li>Your session token has expired or is invalid</li>
                    </ul>
                    <p className="mt-2">
                      LinkedIn's Marketing Developer Platform requires approval for most marketing API use cases.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Edge function errors during authentication</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      If you're seeing edge function errors during authentication:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Check that all required API keys and secrets are properly set in the Supabase environment</li>
                      <li>Verify that the edge functions have been deployed properly</li>
                      <li>Check if there are CORS issues between your frontend and the edge functions</li>
                      <li>Examine the edge function logs in the Supabase dashboard for detailed error information</li>
                    </ul>
                    <p className="mt-2">
                      Use the diagnostics tool above to test edge function connectivity.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>How do I check if my API credentials are valid?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Use the Connection Diagnostics tool at the top of this page to test if your API credentials are properly configured and working. This will help identify if the issue is with your credentials, permissions, or the connection to the ad platforms.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Why am I redirected to the landing page after connecting?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      This could be a misconfiguration. After connecting, you should land on the Create Campaign page. If this issue persists, please check your OAuth callback configuration in the Supabase dashboard or contact support for assistance.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>How do I stay logged in across sessions?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Your login should persist unless you explicitly log out. If you're frequently being logged out, try clearing your browser cache or checking your local storage settings. Make sure you don't have browser extensions that might be clearing cookies or blocking storage access.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>Can I connect multiple ad accounts?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Currently, you can connect one account per platform (Google Ads, Meta Ads, LinkedIn Ads, etc.) per user. If you need to manage multiple accounts, you may need to create separate users for each account. Contact us if you require multi-account support for your agency.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>What happens if I forget my password?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Click the "Forgot Password" link on the login page, enter your email address, and follow the password reset instructions sent to your inbox. The reset link expires after 24 hours, so be sure to use it promptly.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger>How do I switch between light and dark mode?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      ZeroAgency AI automatically adapts to your system preference. To change the theme, adjust your system or browser settings. You can also toggle the theme manually by clicking the theme icon in the sidebar navigation.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default SupportPage;
