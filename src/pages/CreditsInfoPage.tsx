
import React from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CreditCard, Coins, BarChart4, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getCreditCost } from "@/services/credits/creditCosts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

const CreditsInfoPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
      <div className="container mx-auto py-6 space-y-6 max-w-5xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate(-1)} className="p-2 h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Credit System</h1>
              <p className="text-muted-foreground">How credits work in AI AdGuru</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center gap-3">
              <div className="bg-muted p-2 rounded-md text-center">
                <p className="text-sm text-muted-foreground">Your Credits</p>
                <p className="text-2xl font-bold">{user.credits || 0}</p>
              </div>
              <Button onClick={() => navigate("/billing")}>
                <Coins className="mr-2 h-4 w-4" />
                Get More Credits
              </Button>
            </div>
          )}
        </div>
        
        <Alert className="bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800 text-brand-800 dark:text-brand-200">
          <Info className="h-4 w-4" />
          <AlertTitle>What are credits?</AlertTitle>
          <AlertDescription>
            Credits are the currency used within AI AdGuru to generate AI content, create campaigns, and optimize your ads.
            Different features consume different amounts of credits.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="usages" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="usages">Credit Usage</TabsTrigger>
            <TabsTrigger value="plans">Pricing Plans</TabsTrigger>
            <TabsTrigger value="info">How It Works</TabsTrigger>
          </TabsList>
          
          <TabsContent value="usages" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-brand-100 dark:border-brand-800 shadow-sm overflow-hidden">
                <CardHeader className="bg-brand-50 dark:bg-brand-900/20 border-b border-brand-100 dark:border-brand-800">
                  <CardTitle className="flex items-center text-xl">
                    <CreditCard className="mr-2 h-5 w-5 text-brand-600" />
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
          </TabsContent>
          
          <TabsContent value="plans" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border hover:shadow-md transition-all duration-200">
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <CardDescription>Perfect for testing the platform</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$49</span>
                    <span className="text-muted-foreground ml-1">/one-time</span>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Coins className="h-5 w-5 text-brand-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">100 credits</p>
                        <p className="text-sm text-muted-foreground">Create 20 search ads or 20 social ads</p>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline" onClick={() => navigate("/billing")}>
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-primary bg-primary/5 hover:shadow-md transition-all duration-200 relative">
                <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3">
                  <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">Popular</span>
                </div>
                <CardHeader>
                  <CardTitle>Professional</CardTitle>
                  <CardDescription>Most popular for small businesses</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$99</span>
                    <span className="text-muted-foreground ml-1">/one-time</span>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Coins className="h-5 w-5 text-brand-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">250 credits</p>
                        <p className="text-sm text-muted-foreground">50 search ads or 50 social ads</p>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => navigate("/billing")}>
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border hover:shadow-md transition-all duration-200">
                <CardHeader>
                  <CardTitle>Agency</CardTitle>
                  <CardDescription>Ideal for agencies managing multiple clients</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$249</span>
                    <span className="text-muted-foreground ml-1">/one-time</span>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Coins className="h-5 w-5 text-brand-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">700 credits</p>
                        <p className="text-sm text-muted-foreground">140 search ads or 140 social ads</p>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline" onClick={() => navigate("/billing")}>
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How Credits Work</CardTitle>
                <CardDescription>Understanding our credit system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-800 flex items-center justify-center text-brand-700 dark:text-brand-300 mr-3 flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-medium text-lg">Purchase Credits</h3>
                      <p className="text-muted-foreground mt-1">
                        Buy a credit package that fits your needs. Credits never expire, so you can use them at your own pace.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-800 flex items-center justify-center text-brand-700 dark:text-brand-300 mr-3 flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-medium text-lg">Generate AI Content</h3>
                      <p className="text-muted-foreground mt-1">
                        Create ads, generate images, and get AI optimizations. Each action costs a specific number of credits.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-800 flex items-center justify-center text-brand-700 dark:text-brand-300 mr-3 flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-medium text-lg">Track Usage</h3>
                      <p className="text-muted-foreground mt-1">
                        Monitor your credit usage in your account. You'll see exactly how many credits each action costs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-800 flex items-center justify-center text-brand-700 dark:text-brand-300 mr-3 flex-shrink-0">4</div>
                    <div>
                      <h3 className="font-medium text-lg">Top Up When Needed</h3>
                      <p className="text-muted-foreground mt-1">
                        When your credits run low, simply purchase more. We'll send you a notification when you're running low.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Do credits expire?</h3>
                  <p className="text-muted-foreground mt-1">No, your credits never expire. Use them at your own pace.</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Can I get a refund for unused credits?</h3>
                  <p className="text-muted-foreground mt-1">Credits are non-refundable, but they never expire so you can use them anytime.</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Are there any monthly fees?</h3>
                  <p className="text-muted-foreground mt-1">No, we only charge for credits. There are no subscription or monthly fees.</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Can I share credits with team members?</h3>
                  <p className="text-muted-foreground mt-1">Credits are tied to your account, but team members can use them when working on your campaigns.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default CreditsInfoPage;
