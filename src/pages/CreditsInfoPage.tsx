
import React from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CreditCard, Coins, BarChart4, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getCreditCost } from "@/services/credits/creditCosts";

const CreditsInfoPage = () => {
  const navigate = useNavigate();
  
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
    <AppLayout activePage="credits">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Credits System</h1>
            <p className="text-muted-foreground mt-1">Learn how credits work and when they're consumed</p>
          </div>
          <Button onClick={() => navigate("/billing")}>
            <Coins className="mr-2 h-4 w-4" />
            Purchase Credits
          </Button>
        </div>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>What are credits?</AlertTitle>
          <AlertDescription>
            Credits are the currency used within AI AdGuru to generate AI content, create campaigns, and optimize your ads.
            Different features consume different amounts of credits.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-blue-500" />
                Ad Creation
              </CardTitle>
              <CardDescription>Credits used when creating new ads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Google Search Ads (5 variations)</span>
                  <span className="font-semibold">{googleAdsCost} credits</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Includes headline, description, and URL path optimization
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Instagram/Meta Ads (with image)</span>
                  <span className="font-semibold">{metaAdsCost} credits</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Includes caption, AI-generated image, and hashtags
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>LinkedIn Text Ads</span>
                  <span className="font-semibold">{linkedInAdsCost} credits</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Professionally-toned ad copy for business audience
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart4 className="mr-2 h-5 w-5 text-green-500" />
                AI Optimization
              </CardTitle>
              <CardDescription>Credits used for ongoing campaign improvement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Daily Optimization</span>
                  <span className="font-semibold">{dailyOptimizationCost} credits/day</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  AI analyzes and adjusts your campaigns every 24 hours
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>3-Day Optimization</span>
                  <span className="font-semibold">{every3DaysOptimizationCost} credits/cycle</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Balance between cost and performance
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Weekly Optimization</span>
                  <span className="font-semibold">{weeklyOptimizationCost} credits/week</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Most cost-effective option for stable campaigns
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-purple-500" />
              Additional Features
            </CardTitle>
            <CardDescription>Other ways credits are used in the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Individual Image Generation</span>
                  <span className="font-semibold">{imageGenerationCost} credits</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate a single AI image using DALL·E 3
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Website Analysis</span>
                  <span className="font-semibold">{websiteAnalysisCost} credits</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  AI analyzes your website for ad-worthy content
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Custom AI Insights Report</span>
                  <span className="font-semibold">{aiInsightsReportCost} credits</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  In-depth analysis of your campaigns with recommendations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Credits Pricing</CardTitle>
            <CardDescription>Our flexible credit packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 flex flex-col">
                <div className="font-semibold text-xl">Starter</div>
                <div className="text-3xl font-bold my-2">$49</div>
                <div className="text-muted-foreground">100 credits</div>
                <div className="mt-4 text-sm text-muted-foreground">Perfect for testing the platform</div>
              </div>
              
              <div className="border-2 border-primary rounded-lg p-4 flex flex-col bg-primary/5">
                <div className="font-semibold text-xl">Professional</div>
                <div className="text-3xl font-bold my-2">$99</div>
                <div className="text-muted-foreground">250 credits</div>
                <div className="mt-4 text-sm text-muted-foreground">Most popular for small businesses</div>
                <div className="mt-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs w-fit rounded-full">Best Value</div>
              </div>
              
              <div className="border rounded-lg p-4 flex flex-col">
                <div className="font-semibold text-xl">Agency</div>
                <div className="text-3xl font-bold my-2">$249</div>
                <div className="text-muted-foreground">700 credits</div>
                <div className="mt-4 text-sm text-muted-foreground">Ideal for agencies managing multiple clients</div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button size="lg" onClick={() => navigate("/billing")}>
                Purchase Credits
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreditsInfoPage;
