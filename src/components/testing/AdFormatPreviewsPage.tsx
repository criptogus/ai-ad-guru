
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import GoogleAdPreview from "@/components/campaign/ad-preview/google/GoogleAdPreview";
import MicrosoftAdPreview from "@/components/campaign/ad-preview/microsoft/MicrosoftAdPreview";
import LinkedInAdPreview from "@/components/campaign/ad-preview/linkedin/LinkedInAdPreview";
import InstagramPreview from "@/components/campaign/ad-preview/meta/instagram-preview/InstagramPreview";
import AdPreviewSwitcher from "@/components/campaign/ad-preview/AdPreviewSwitcher";

const AdFormatPreviewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Sample data for previews
  const analysisResult: WebsiteAnalysisResult = {
    companyName: "Acme Tech Solutions",
    brandTone: "Professional & Innovative",
    targetAudience: "Business professionals, tech enthusiasts",
    uniqueSellingPoints: ["AI-powered", "Easy to use", "24/7 support"],
    keywords: ["technology", "innovation", "AI", "productivity", "efficiency"],
    callToAction: ["Get Started Today", "Book a Demo"],
    businessDescription: "Leading provider of AI-powered business solutions",
    websiteUrl: "https://acmetech.example.com"
  };
  
  const googleAd: GoogleAd = {
    headline1: "AI-Powered Business Solutions",
    headline2: "Boost Productivity by 30%",
    headline3: "Start Your Free Trial Today",
    description1: "Our AI technology helps companies streamline operations, reduce costs, and improve customer experiences.",
    description2: "Join 10,000+ businesses already saving time and money. 24/7 support included.",
    path1: "ai-solutions",
    path2: "free-trial",
    headlines: [
      "AI-Powered Business Solutions",
      "Boost Productivity by 30%",
      "Start Your Free Trial Today"
    ],
    descriptions: [
      "Our AI technology helps companies streamline operations, reduce costs, and improve customer experiences.",
      "Join 10,000+ businesses already saving time and money. 24/7 support included."
    ],
    siteLinks: [
      { title: "Product Features", description: "Explore our key features", link: "/features" },
      { title: "Pricing Plans", description: "Find the right plan for you", link: "/pricing" },
      { title: "Case Studies", description: "See customer success stories", link: "/case-studies" },
      { title: "Support", description: "Get help when you need it", link: "/support" }
    ]
  };
  
  const metaAd: MetaAd = {
    headline: "Transform Your Business Operations",
    primaryText: "Discover how our AI-powered platform is helping companies like yours save 15+ hours per week on manual tasks. Our intuitive dashboard brings all your metrics into one place, giving you real-time insights when you need them most. ✨ #AIinnovation #BusinessEfficiency",
    description: "Try Free Demo",
    imageUrl: "https://images.unsplash.com/photo-1581092921461-39b9bcd37681?auto=format&fit=crop&q=80&w=1470",
    imagePrompt: "Modern business dashboard on laptop screen in stylish office environment"
  };
  
  const linkedInAd: MetaAd = {
    headline: "Streamline Operations with AI",
    primaryText: "Are manual processes slowing down your business growth? Our AI platform automates repetitive tasks, giving your team back 15+ hours per week to focus on what matters most. See how companies like yours have increased productivity by 30% in just 60 days.\n\nRequest a personalized demo today and discover what's possible.",
    description: "Request Demo",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1470",
    imagePrompt: "Business professionals collaborating around a dashboard showing improved metrics"
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Ad Format Previews</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Combined View</TabsTrigger>
          <TabsTrigger value="google">Google Ads</TabsTrigger>
          <TabsTrigger value="instagram">Instagram Ads</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
          <TabsTrigger value="microsoft">Microsoft Ads</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>All Ad Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <AdPreviewSwitcher 
                analysisResult={analysisResult}
                googleAd={googleAd}
                metaAd={metaAd}
                microsoftAd={googleAd}
                linkedInAd={linkedInAd}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="google" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Google Search Ad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <GoogleAdPreview 
                  ad={googleAd} 
                  domain={analysisResult.websiteUrl?.replace('https://', '').replace('http://', '') || 'example.com'} 
                />
                
                <div className="mt-8 text-sm text-muted-foreground max-w-2xl">
                  <h3 className="font-semibold mb-2">Google Ads Best Practices:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use all 3 headlines (30 characters each) and both descriptions (90 characters each)</li>
                    <li>Include keywords in headlines and URLs for better quality score</li>
                    <li>Put the most important information in Headline 1 and Description 1</li>
                    <li>Use a strong call-to-action in Headline 3</li>
                    <li>Test different combinations of headlines and descriptions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="instagram" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Instagram Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex flex-col items-center">
                    <Label className="mb-4">Feed Post</Label>
                    <InstagramPreview 
                      ad={metaAd} 
                      companyName={analysisResult.companyName} 
                      viewMode="feed" 
                    />
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <Label className="mb-4">Story</Label>
                    <InstagramPreview 
                      ad={metaAd} 
                      companyName={analysisResult.companyName} 
                      viewMode="story" 
                    />
                  </div>
                </div>
                
                <div className="mt-8 text-sm text-muted-foreground max-w-2xl">
                  <h3 className="font-semibold mb-2">Instagram Ads Best Practices:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use high-quality, eye-catching images that represent your brand</li>
                    <li>Keep captions concise but engaging (under 125 characters performs best)</li>
                    <li>Use emojis strategically to increase engagement</li>
                    <li>Include a clear call-to-action that matches your campaign goal</li>
                    <li>Use relevant hashtags to increase discoverability (3-5 is optimal)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="linkedin" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>LinkedIn Ad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <LinkedInAdPreview 
                  ad={linkedInAd} 
                  analysisResult={analysisResult} 
                />
                
                <div className="mt-8 text-sm text-muted-foreground max-w-2xl">
                  <h3 className="font-semibold mb-2">LinkedIn Ads Best Practices:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use a professional tone that matches your brand voice</li>
                    <li>Primary text can be longer (up to 600 characters)</li>
                    <li>Lead with value proposition in the first 2-3 lines</li>
                    <li>Use paragraph breaks to improve readability</li>
                    <li>Include a direct CTA that aligns with your campaign goal</li>
                    <li>Use images that show people using your product/service</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="microsoft" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Microsoft (Bing) Ad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <MicrosoftAdPreview 
                  ad={googleAd} 
                  domain={analysisResult.websiteUrl?.replace('https://', '').replace('http://', '') || 'example.com'} 
                />
                
                <div className="mt-8 text-sm text-muted-foreground max-w-2xl">
                  <h3 className="font-semibold mb-2">Microsoft Ads Best Practices:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Similar to Google Ads but with some unique features</li>
                    <li>Experiment with action extensions and multi-image extensions</li>
                    <li>Use sitelink extensions to improve CTR</li>
                    <li>Target an older, more professional demographic</li>
                    <li>Import high-performing Google Ads campaigns</li>
                    <li>Utilize Microsoft-specific features like LinkedIn profile targeting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdFormatPreviewsPage;
