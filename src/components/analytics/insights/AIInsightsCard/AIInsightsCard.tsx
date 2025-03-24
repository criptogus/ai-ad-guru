
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleAd } from "@/hooks/adGeneration";
import { GoogleAdTab } from "./tabs/GoogleAdTab";
import { MetaAdTab } from "./tabs/MetaAdTab";
import { MicrosoftAdTab } from "./tabs/MicrosoftAdTab";

interface AIInsightsCardProps {
  campaignId: string;
}

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ campaignId }) => {
  // This would normally come from an API call
  const mockGoogleAd: GoogleAd = {
    headlines: [
      "Boost Your Business Today",
      "Professional AI Solutions",
      "Smart Advertising Platform"
    ],
    descriptions: [
      "Create high-converting ads with our AI-powered platform. Save time and money.",
      "Get more leads and sales with automated ad generation and optimization."
    ]
  };
  
  const mockMicrosoftAd = mockGoogleAd;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights & Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="google">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="google">Google Ads</TabsTrigger>
            <TabsTrigger value="meta">Instagram</TabsTrigger>
            <TabsTrigger value="microsoft">Microsoft</TabsTrigger>
          </TabsList>
          <TabsContent value="google" className="pt-4">
            <GoogleAdTab ad={mockGoogleAd} />
          </TabsContent>
          <TabsContent value="meta" className="pt-4">
            <MetaAdTab />
          </TabsContent>
          <TabsContent value="microsoft" className="pt-4">
            <MicrosoftAdTab ad={mockMicrosoftAd} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
