
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Goal, Globe } from "lucide-react";
import { useConnectionTest } from "@/hooks/adConnections/useConnectionTest";
import ConnectionTestCard from "@/components/testing/ConnectionTestCard";
import { useAdGeneration, GoogleAd, MetaAd } from "@/hooks/useAdGeneration";
import MetaAdsTestArea from "@/components/testing/MetaAdsTestArea";
import GoogleAdsTestArea from "@/components/testing/GoogleAdsTestArea";
import MicrosoftAdsTestArea from "@/components/testing/MicrosoftAdsTestArea";
import LinkedInAdsTestArea from "@/components/testing/LinkedInAdsTestArea";

const TestAdsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("connections");
  const { isLoading, connectionStatus, statusDetails, testConnection } = useConnectionTest();

  return (
    <AppLayout activePage="testing">
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Ad Testing Area</h1>
            <p className="text-muted-foreground">Test API connections and ad generation</p>
          </div>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Test Mode</AlertTitle>
          <AlertDescription>
            This area allows you to test API connections and ad generation without spending credits or creating campaigns.
            Test results will not be saved.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="connections" className="flex items-center gap-1">
              API Connections
            </TabsTrigger>
            <TabsTrigger value="google" className="flex items-center gap-1">
              <Goal className="h-4 w-4" />
              Google Ads
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              LinkedIn Ads
            </TabsTrigger>
            <TabsTrigger value="microsoft" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              Microsoft Ads
            </TabsTrigger>
            <TabsTrigger value="meta" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              Meta Ads
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connections">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ConnectionTestCard 
                platform="linkedin"
                isLoading={isLoading.linkedin}
                status={connectionStatus.linkedin}
                statusDetails={statusDetails.linkedin}
                onTest={() => testConnection('linkedin')}
              />
              
              <ConnectionTestCard 
                platform="microsoft"
                isLoading={isLoading.microsoft}
                status={connectionStatus.microsoft}
                statusDetails={statusDetails.microsoft}
                onTest={() => testConnection('microsoft')}
              />
              
              <ConnectionTestCard 
                platform="google"
                isLoading={isLoading.google}
                status={connectionStatus.google}
                statusDetails={statusDetails.google}
                onTest={() => testConnection('google')}
              />
              
              <ConnectionTestCard 
                platform="meta"
                isLoading={isLoading.meta}
                status={connectionStatus.meta}
                statusDetails={statusDetails.meta}
                onTest={() => testConnection('meta')}
              />
            </div>
          </TabsContent>

          <TabsContent value="google">
            <GoogleAdsTestArea />
          </TabsContent>

          <TabsContent value="linkedin">
            <LinkedInAdsTestArea />
          </TabsContent>

          <TabsContent value="microsoft">
            <MicrosoftAdsTestArea />
          </TabsContent>
          
          <TabsContent value="meta">
            <MetaAdsTestArea />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default TestAdsPage;
