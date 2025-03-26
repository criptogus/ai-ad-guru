
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { GoogleAdTab } from "./tabs/GoogleAdTab";
import { MetaAdTab } from "./tabs/MetaAdTab";
import { MicrosoftAdTab } from "./tabs/MicrosoftAdTab";

interface AIInsightsCardProps {
  campaignId?: string;
}

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ campaignId }) => {
  // This would normally come from an API call
  const mockGoogleAd: GoogleAd = {
    headline1: "Boost Your Business Today",
    headline2: "Professional AI Solutions",
    headline3: "Smart Advertising Platform",
    description1: "Create high-converting ads with our AI-powered platform. Save time and money.",
    description2: "Get more leads and sales with automated ad generation and optimization.",
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
  
  // Create a mock MetaAd for use in the MetaAdTab
  const mockMetaAd: MetaAd = {
    primaryText: "Take your advertising to the next level with AI-powered automation.",
    headline: "Smart Ad Platform",
    description: "Create, optimize, and manage ads across platforms with ease.",
    imagePrompt: "Modern digital marketing dashboard with AI recommendations",
    imageUrl: "https://example.com/placeholder.jpg"
  };
  
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
            <MetaAdTab ad={mockMetaAd} />
          </TabsContent>
          <TabsContent value="microsoft" className="pt-4">
            <MicrosoftAdTab ad={mockMicrosoftAd} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Add explicit default export
export default AIInsightsCard;
