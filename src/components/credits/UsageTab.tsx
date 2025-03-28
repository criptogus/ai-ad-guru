
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, BarChart4, Clock } from "lucide-react";
import { getCreditCost } from "@/services/credits/creditCosts";

const UsageTab = () => {
  // Get individual credit costs
  const googleAdsCost = getCreditCost("googleAds");
  const metaAdsCost = getCreditCost("metaAds");
  const linkedInAdsCost = getCreditCost("linkedInAds");
  const imageGenerationCost = getCreditCost("imageGeneration");
  const websiteAnalysisCost = getCreditCost("websiteAnalysis");
  const aiInsightsReportCost = getCreditCost("aiInsightsReport");
  const dailyOptimizationCost = getCreditCost("adOptimization.daily");
  const every3DaysOptimizationCost = getCreditCost("adOptimization.every3Days");
  const weeklyOptimizationCost = getCreditCost("adOptimization.weekly");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-brand-100 dark:border-brand-800 shadow-sm overflow-hidden">
          <CardHeader className="bg-brand-50 dark:bg-brand-900/20 border-b border-brand-100 dark:border-brand-800">
            <CardTitle className="flex items-center text-xl">
              <Coins className="mr-2 h-5 w-5 text-brand-600" />
              Ad Creation
            </CardTitle>
            <CardDescription>Credits used when creating new ads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-center">
                <span>Google Search Ads (5 variations)</span>
                <span className="font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/30 py-0.5 px-2 rounded-full">{googleAdsCost} credits</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Includes headline, description, and URL path optimization
              </p>
            </div>
            
            <div className="rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-center">
                <span>Instagram/Meta Ads (with image)</span>
                <span className="font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/30 py-0.5 px-2 rounded-full">{metaAdsCost} credits</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Includes caption, AI-generated image, and hashtags
              </p>
            </div>
            
            <div className="rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-center">
                <span>LinkedIn Text Ads</span>
                <span className="font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/30 py-0.5 px-2 rounded-full">{linkedInAdsCost} credits</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Professionally-toned ad copy for business audience
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-100 dark:border-green-800 shadow-sm overflow-hidden">
          <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800">
            <CardTitle className="flex items-center text-xl">
              <BarChart4 className="mr-2 h-5 w-5 text-green-600" />
              AI Optimization
            </CardTitle>
            <CardDescription>Credits used for ongoing campaign improvement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-center">
                <span>Daily Optimization</span>
                <span className="font-semibold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 py-0.5 px-2 rounded-full">{dailyOptimizationCost} credits/day</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                AI analyzes and adjusts your campaigns every 24 hours
              </p>
            </div>
            
            <div className="rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-center">
                <span>3-Day Optimization</span>
                <span className="font-semibold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 py-0.5 px-2 rounded-full">{every3DaysOptimizationCost} credits/cycle</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Balance between cost and performance
              </p>
            </div>
            
            <div className="rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-center">
                <span>Weekly Optimization</span>
                <span className="font-semibold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 py-0.5 px-2 rounded-full">{weeklyOptimizationCost} credits/week</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Most cost-effective option for stable campaigns
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-purple-100 dark:border-purple-800 shadow-sm overflow-hidden">
        <CardHeader className="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800">
          <CardTitle className="flex items-center text-xl">
            <Clock className="mr-2 h-5 w-5 text-purple-600" />
            Additional Features
          </CardTitle>
          <CardDescription>Other ways credits are used in the platform</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-center">
                <span>Individual Image Generation</span>
                <span className="font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 py-0.5 px-2 rounded-full">{imageGenerationCost} credits</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Generate a single AI image using DALL·E 3
              </p>
            </div>
            
            <div className="rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-center">
                <span>Website Analysis</span>
                <span className="font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 py-0.5 px-2 rounded-full">{websiteAnalysisCost} credits</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                AI analyzes your website for ad-worthy content
              </p>
            </div>
            
            <div className="rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-center">
                <span>Custom AI Insights Report</span>
                <span className="font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 py-0.5 px-2 rounded-full">{aiInsightsReportCost} credits</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                In-depth analysis of your campaigns with recommendations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageTab;
