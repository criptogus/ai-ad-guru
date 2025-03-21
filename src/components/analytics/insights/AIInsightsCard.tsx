
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Sparkles, Zap, LineChart, Target, Copy } from "lucide-react";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { GoogleAdPreview } from "@/components/campaign/ad-preview/google";
import { InstagramPreview } from "@/components/campaign/ad-preview/meta";
import { MicrosoftAdPreview } from "@/components/campaign/ad-preview/microsoft";
import { useToast } from "@/hooks/use-toast";

interface AIInsightsCardProps {
  campaign?: any;
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ campaign }) => {
  const [selectedGoal, setSelectedGoal] = useState<string>("clicks");
  const [previewMode, setPreviewMode] = useState<string>("mobile");
  const { toast } = useToast();

  // Example ads for preview
  const exampleGoogleAd: GoogleAd = {
    headlines: [
      "Boost Your Ad Performance",
      "Get More Conversions Now",
      "AI-Powered Ad Optimization",
    ],
    descriptions: [
      "Our platform automatically optimizes your ads to deliver better results and higher ROI.",
      "Try our advanced optimization tools today and see the difference in your campaigns.",
    ],
  };

  const exampleMetaAd: MetaAd = {
    primaryText:
      "Transform your ad campaigns with AI-powered optimization. Get better results with less effort.",
    headline: "Maximize Your Ad Performance",
    description: "Start Optimizing Today",
    imagePrompt: "Professional marketing team looking at analytics dashboard with increasing graphs",
    imageUrl: "https://placehold.co/600x600/eee/ccc?text=Instagram+Ad+Preview",
  };

  const createABTest = () => {
    toast({
      title: "A/B Test Created",
      description: "A duplicate of this ad has been created for A/B testing.",
    });
  };

  const copyAdToClipboard = () => {
    toast({
      title: "Ad Copied",
      description: "Ad content has been copied to clipboard.",
    });
  };

  return (
    <Card className="border-blue-100 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-blue-500" />
            AI Ad Insights
          </CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            5 credits per optimization
          </Badge>
        </div>
        <CardDescription>
          Preview your ads in different formats and get AI-powered optimization suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1 w-1/2 pr-2">
            <p className="text-sm font-medium">Optimization Goal</p>
            <Select
              value={selectedGoal}
              onValueChange={setSelectedGoal}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clicks">
                  <div className="flex items-center">
                    <Target className="mr-2 h-4 w-4" />
                    <span>Optimize for Clicks</span>
                  </div>
                </SelectItem>
                <SelectItem value="conversions">
                  <div className="flex items-center">
                    <Zap className="mr-2 h-4 w-4" />
                    <span>Maximize Conversions</span>
                  </div>
                </SelectItem>
                <SelectItem value="cpa">
                  <div className="flex items-center">
                    <LineChart className="mr-2 h-4 w-4" />
                    <span>Lower CPA</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1 w-1/2 pl-2">
            <p className="text-sm font-medium">Preview Mode</p>
            <Select
              value={previewMode}
              onValueChange={setPreviewMode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select preview mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile">Mobile Feed</SelectItem>
                <SelectItem value="desktop">Desktop News Feed</SelectItem>
                <SelectItem value="sidebar">Right Column</SelectItem>
                <SelectItem value="search">Search Results</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="google">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="google">Google Ads</TabsTrigger>
            <TabsTrigger value="meta">Instagram</TabsTrigger>
            <TabsTrigger value="microsoft">Microsoft</TabsTrigger>
          </TabsList>

          <TabsContent value="google" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-md p-4 bg-white">
                <GoogleAdPreview ad={exampleGoogleAd} domain="yourdomain.com" />
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h4 className="text-sm font-medium flex items-center text-blue-800">
                    <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                    AI Suggestions
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                      <span>Add specific numbers to headline for better CTR (e.g., "Boost Performance by 40%")</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                      <span>Include a stronger call-to-action in description</span>
                    </li>
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" onClick={createABTest} className="flex-1">
                    Create A/B Test
                  </Button>
                  <Button size="sm" variant="outline" onClick={copyAdToClipboard} className="flex items-center">
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="meta" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-md p-4 bg-white">
                <InstagramPreview ad={exampleMetaAd} companyName="Your Company" />
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h4 className="text-sm font-medium flex items-center text-blue-800">
                    <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                    AI Suggestions
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                      <span>Use more emotional language in primary text to boost engagement</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                      <span>Add user testimonial for social proof (e.g., "Our clients saw 35% better results")</span>
                    </li>
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" onClick={createABTest} className="flex-1">
                    Create A/B Test
                  </Button>
                  <Button size="sm" variant="outline" onClick={copyAdToClipboard} className="flex items-center">
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="microsoft" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-md p-4 bg-white">
                <MicrosoftAdPreview ad={exampleGoogleAd} domain="yourdomain.com" />
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h4 className="text-sm font-medium flex items-center text-blue-800">
                    <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                    AI Suggestions
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                      <span>Target business professionals by mentioning ROI in headlines</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                      <span>Add business-focused keywords that Microsoft Ads users respond to</span>
                    </li>
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" onClick={createABTest} className="flex-1">
                    Create A/B Test
                  </Button>
                  <Button size="sm" variant="outline" onClick={copyAdToClipboard} className="flex items-center">
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" className="w-full">
          <Zap className="h-4 w-4 mr-2" />
          Apply AI Suggestions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIInsightsCard;
