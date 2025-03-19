
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useAdAccountConnections } from "@/hooks/useAdAccountConnections";
import { Button } from "@/components/ui/button";
import { Alert as AlertIcon, Linkedin, Windows } from "lucide-react";

const TestAdsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("linkedin");
  
  const { 
    connections, 
    isLoading,
    initiateLinkedInConnection,
    initiateMicrosoftConnection
  } = useAdAccountConnections();

  const linkedInConnected = connections.some(c => c.platform === "linkedin");
  const microsoftConnected = connections.some(c => c.platform === "microsoft");

  return (
    <AppLayout activePage="test-ads">
      <div className="container mx-auto p-6 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Ad Platform Testing Area</h1>
        
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-[400px] mb-6">
            <TabsTrigger value="linkedin" className="flex items-center gap-2">
              <Linkedin size={16} />
              LinkedIn Ads
            </TabsTrigger>
            <TabsTrigger value="microsoft" className="flex items-center gap-2">
              <Windows size={16} />
              Microsoft Ads
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="linkedin">
            <Card>
              <CardHeader>
                <CardTitle>LinkedIn Ads Test Area</CardTitle>
                <CardDescription>
                  Test and preview LinkedIn ad formats before publishing
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {!linkedInConnected ? (
                  <div className="flex flex-col items-center justify-center p-10 bg-muted/20 rounded-md">
                    <AlertIcon className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Connect LinkedIn Ads First</h3>
                    <p className="text-muted-foreground mb-4 text-center max-w-md">
                      To test LinkedIn ads, you need to connect your LinkedIn Ads account first.
                    </p>
                    <Button 
                      onClick={initiateLinkedInConnection} 
                      className="flex items-center gap-2"
                    >
                      <Linkedin size={16} />
                      Connect LinkedIn Ads
                    </Button>
                  </div>
                ) : (
                  <Alert className="mb-6">
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>LinkedIn Ads Connected</AlertTitle>
                    <AlertDescription>
                      Your LinkedIn Ads account is connected and ready for testing.
                    </AlertDescription>
                  </Alert>
                  // Here we'll add the LinkedIn ad creation interface soon
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="microsoft">
            <Card>
              <CardHeader>
                <CardTitle>Microsoft Ads Test Area</CardTitle>
                <CardDescription>
                  Test and preview Microsoft ad formats before publishing
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {!microsoftConnected ? (
                  <div className="flex flex-col items-center justify-center p-10 bg-muted/20 rounded-md">
                    <AlertIcon className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Connect Microsoft Ads First</h3>
                    <p className="text-muted-foreground mb-4 text-center max-w-md">
                      To test Microsoft ads, you need to connect your Microsoft Ads account first.
                    </p>
                    <Button 
                      onClick={initiateMicrosoftConnection} 
                      className="flex items-center gap-2"
                    >
                      <Windows size={16} />
                      Connect Microsoft Ads
                    </Button>
                  </div>
                ) : (
                  <Alert className="mb-6">
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Microsoft Ads Connected</AlertTitle>
                    <AlertDescription>
                      Your Microsoft Ads account is connected and ready for testing.
                    </AlertDescription>
                  </Alert>
                  // Here we'll add the Microsoft ad creation interface soon
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default TestAdsPage;
