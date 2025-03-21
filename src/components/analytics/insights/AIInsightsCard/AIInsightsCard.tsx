
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ControlsSection } from "./ControlsSection";
import { GoogleAdTab } from "./tabs/GoogleAdTab";
import { MetaAdTab } from "./tabs/MetaAdTab";
import { MicrosoftAdTab } from "./tabs/MicrosoftAdTab";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

interface AIInsightsCardProps {
  campaign?: any;
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ campaign }) => {
  const [selectedGoal, setSelectedGoal] = useState<string>("clicks");
  const [previewMode, setPreviewMode] = useState<string>("mobile");

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

  return (
    <Card className="border-blue-100 shadow-sm h-full overflow-auto">
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
      <CardContent className="pb-2 overflow-hidden">
        <ControlsSection 
          selectedGoal={selectedGoal}
          setSelectedGoal={setSelectedGoal}
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
        />

        <Tabs defaultValue="google">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="google">Google Ads</TabsTrigger>
            <TabsTrigger value="meta">Instagram</TabsTrigger>
            <TabsTrigger value="microsoft">Microsoft</TabsTrigger>
          </TabsList>

          <TabsContent value="google">
            <GoogleAdTab ad={exampleGoogleAd} />
          </TabsContent>

          <TabsContent value="meta">
            <MetaAdTab ad={exampleMetaAd} />
          </TabsContent>

          <TabsContent value="microsoft">
            <MicrosoftAdTab ad={exampleGoogleAd} />
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
