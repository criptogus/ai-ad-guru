
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import GoogleAdsTestArea from "./GoogleAdsTestArea";
import MetaAdsTestArea from "./MetaAdsTestArea";
import LinkedInAdsTestArea from "./LinkedInAdsTestArea";
import MicrosoftAdsTestArea from "./MicrosoftAdsTestArea";

const AdPreviewsTestArea: React.FC = () => {
  const [activeTab, setActiveTab] = useState("google");
  const { toast } = useToast();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    toast({
      title: `Switched to ${value} ad previews`,
      description: "Test different ad layouts and formats.",
      duration: 2000,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ad Previews Testing Area</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="google">Google Ads</TabsTrigger>
              <TabsTrigger value="meta">Instagram Ads</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
              <TabsTrigger value="microsoft">Microsoft Ads</TabsTrigger>
            </TabsList>
            
            <TabsContent value="google">
              <GoogleAdsTestArea />
            </TabsContent>
            
            <TabsContent value="meta">
              <MetaAdsTestArea />
            </TabsContent>
            
            <TabsContent value="linkedin">
              <LinkedInAdsTestArea />
            </TabsContent>
            
            <TabsContent value="microsoft">
              <MicrosoftAdsTestArea />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdPreviewsTestArea;
