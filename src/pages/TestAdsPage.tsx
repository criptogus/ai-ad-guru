
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle, 
  Linkedin, 
  MicrosoftIcon 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Ad {
  headline?: string;
  description?: string;
  headlines?: string[];
  descriptions?: string[];
}

const TestAdsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("linkedin");
  const [businessName, setBusinessName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [adGoal, setAdGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAds, setGeneratedAds] = useState<Ad[]>([]);

  const handleGenerateAds = async () => {
    if (!businessName || !targetAudience || !adGoal) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields to generate ads",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate API call to generate ads
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let mockAds: Ad[] = [];
      
      if (activeTab === "linkedin") {
        mockAds = [
          {
            headline: `Transform Your ${businessName} with AI-Powered Solutions`,
            description: `Looking to revolutionize how you reach ${targetAudience}? Our proven strategies have helped companies achieve their ${adGoal} goals with minimal effort. Learn how our platform can work for you.`
          },
          {
            headline: `${businessName}: Unlock New Growth Opportunities`,
            description: `${targetAudience} are waiting to discover your brand. Our AI-driven platform helps you connect with them authentically and drive ${adGoal} like never before. Book a demo today!`
          },
          {
            headline: `Data-Driven ${adGoal} for ${businessName}`,
            description: `Stop guessing what works with ${targetAudience}. Our AI-powered solution delivers provable results for companies just like ${businessName}. Join industry leaders who've transformed their approach.`
          }
        ];
      } else if (activeTab === "microsoft") {
        mockAds = [
          {
            headlines: [
              `${businessName} Solutions`,
              `Transform Your Business`,
              `Industry-Leading ${adGoal}`
            ],
            descriptions: [
              `Reach ${targetAudience} effectively with our proven strategies.`,
              `Boost your ${adGoal} results today with our cutting-edge platform.`
            ]
          },
          {
            headlines: [
              `Maximize Your ${adGoal}`,
              `${businessName} Growth`,
              `Connect with ${targetAudience}`
            ],
            descriptions: [
              `Industry-leading solutions for businesses like ${businessName}.`,
              `Data-driven strategies that deliver measurable results. Try now!`
            ]
          }
        ];
      }
      
      setGeneratedAds(mockAds);
      
      toast({
        title: "Ads Generated",
        description: `Successfully created ${mockAds.length} ad variations`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your ads. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderLinkedInAds = () => {
    if (generatedAds.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
            <Linkedin className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No LinkedIn Ads Generated</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Fill out the business details and click "Generate Ads" to create LinkedIn ad variations
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {generatedAds.map((ad, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{ad.headline}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{ad.description}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-0">
              <Button variant="outline" size="sm">Edit</Button>
              <Button size="sm">Use This Ad</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  const renderMicrosoftAds = () => {
    if (generatedAds.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
            <MicrosoftIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No Microsoft Ads Generated</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Fill out the business details and click "Generate Ads" to create Microsoft Ads variations
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {generatedAds.map((ad, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Headlines:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 mb-4">
                {ad.headlines?.map((headline, hIndex) => (
                  <li key={hIndex} className="mb-1">{headline}</li>
                ))}
              </ul>
              <CardTitle className="text-base mb-2">Descriptions:</CardTitle>
              <ul className="list-disc pl-5">
                {ad.descriptions?.map((desc, dIndex) => (
                  <li key={dIndex} className="mb-1">{desc}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-0">
              <Button variant="outline" size="sm">Edit</Button>
              <Button size="sm">Use This Ad</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <AppLayout activePage="test-ads">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Test Ad Generation</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
                <CardDescription>
                  Enter information about your business to generate ad variations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="business-name" className="text-sm font-medium mb-1 block">
                    Business Name
                  </label>
                  <Input 
                    id="business-name"
                    placeholder="e.g., Acme Inc." 
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="target-audience" className="text-sm font-medium mb-1 block">
                    Target Audience
                  </label>
                  <Input 
                    id="target-audience"
                    placeholder="e.g., small business owners" 
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="ad-goal" className="text-sm font-medium mb-1 block">
                    Ad Goal
                  </label>
                  <Input 
                    id="ad-goal"
                    placeholder="e.g., increase website conversions" 
                    value={adGoal}
                    onChange={(e) => setAdGoal(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleGenerateAds}
                  disabled={isGenerating || !businessName || !targetAudience || !adGoal}
                >
                  {isGenerating ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Ads
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tips for Effective Ads</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p className="text-sm">Be specific about your target audience</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p className="text-sm">Focus on benefits, not features</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p className="text-sm">Include clear call-to-actions</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <p className="text-sm">Avoid making unrealistic claims or promises</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Generated Ad Variations</CardTitle>
                <CardDescription>
                  Preview and customize your AI-generated ads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="linkedin" className="flex items-center">
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn Ads
                    </TabsTrigger>
                    <TabsTrigger value="microsoft" className="flex items-center">
                      <MicrosoftIcon className="mr-2 h-4 w-4" />
                      Microsoft Ads
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="linkedin">
                    {renderLinkedInAds()}
                  </TabsContent>
                  
                  <TabsContent value="microsoft">
                    {renderMicrosoftAds()}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TestAdsPage;
