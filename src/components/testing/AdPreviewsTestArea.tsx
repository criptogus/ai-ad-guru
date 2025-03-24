
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import GoogleAdsTestArea from "./GoogleAdsTestArea";
import MetaAdsTestArea from "./MetaAdsTestArea";
import MicrosoftAdsTestArea from "./MicrosoftAdsTestArea";
import LinkedInAdsTestArea from "./LinkedInAdsTestArea";

const AdPreviewsTestArea: React.FC = () => {
  const [activeTab, setActiveTab] = useState("google");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Ad Previews Test Area</h1>
      <p className="text-muted-foreground mb-6">
        Use this page to test various ad preview components and their states
      </p>

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="google">Google Ads</TabsTrigger>
              <TabsTrigger value="meta">Meta Ads</TabsTrigger>
              <TabsTrigger value="microsoft">Microsoft Ads</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
            </TabsList>
            
            <TabsContent value="google">
              <GoogleAdsTestArea />
            </TabsContent>
            
            <TabsContent value="meta">
              <MetaAdsTestArea />
            </TabsContent>
            
            <TabsContent value="microsoft">
              <MicrosoftAdsTestArea />
            </TabsContent>
            
            <TabsContent value="linkedin">
              <LinkedInAdsTestArea />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdPreviewsTestArea;
