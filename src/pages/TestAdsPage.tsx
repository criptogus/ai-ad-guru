
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Trash, RefreshCw, GoogleIcon, GlobeIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TestAdsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("google");

  return (
    <AppLayout activePage="testing">
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Ad Testing Area</h1>
            <p className="text-muted-foreground">Test ad generation without creating campaigns</p>
          </div>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Test Mode</AlertTitle>
          <AlertDescription>
            This area allows you to test ad generation without spending credits or creating campaigns.
            Generated ads will not be saved.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="google" className="flex items-center gap-1">
              <GoogleIcon className="h-4 w-4" />
              Google Ads
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center gap-1">
              <GlobeIcon className="h-4 w-4" />
              LinkedIn Ads
            </TabsTrigger>
            <TabsTrigger value="microsoft" className="flex items-center gap-1">
              <GlobeIcon className="h-4 w-4" />
              Microsoft Ads
            </TabsTrigger>
          </TabsList>

          <TabsContent value="google">
            <Card>
              <CardHeader>
                <CardTitle>Google Ads Testing</CardTitle>
                <CardDescription>Generate test Google Ads without creating a campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <p className="text-muted-foreground">Google Ads test area is coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="linkedin">
            <Card>
              <CardHeader>
                <CardTitle>LinkedIn Ads Testing</CardTitle>
                <CardDescription>Generate test LinkedIn Ads without creating a campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <p className="text-muted-foreground">LinkedIn Ads test area is coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="microsoft">
            <Card>
              <CardHeader>
                <CardTitle>Microsoft Ads Testing</CardTitle>
                <CardDescription>Generate test Microsoft Ads without creating a campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <p className="text-muted-foreground">Microsoft Ads test area is coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default TestAdsPage;
