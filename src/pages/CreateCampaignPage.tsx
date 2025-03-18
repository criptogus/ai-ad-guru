
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ArrowLeft, Globe } from "lucide-react";

const CreateCampaignPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [website, setWebsite] = useState("");
  const [campaignData, setCampaignData] = useState({
    name: "",
    platform: "google", // Default: google or meta
    budget: 50,
    budgetType: "daily",
    startDate: "",
    endDate: "",
    objective: "traffic",
    targetAudience: "",
    description: "",
  });

  // Mock function to simulate website analysis with OpenAI
  const analyzeWebsite = async (url: string) => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a website URL",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI analysis result
    const mockAnalysis = {
      name: url.includes('.') ? url.split('.')[0] : "My Campaign",
      description: "This campaign promotes a professional business website that offers valuable services to customers. The brand appears to focus on quality and customer satisfaction.",
      targetAudience: "Professionals aged 25-45 who are interested in business services, technology, and productivity tools.",
    };
    
    setCampaignData({
      ...campaignData,
      name: mockAnalysis.name + " Campaign",
      description: mockAnalysis.description,
      targetAudience: mockAnalysis.targetAudience,
    });
    
    setIsAnalyzing(false);
    setCurrentStep(2);
    
    toast({
      title: "Website analyzed successfully",
      description: "We've gathered information to help create your campaign."
    });
  };

  const handleNext = () => {
    // Validate current step
    if (currentStep === 2) {
      if (!campaignData.name || !campaignData.description) {
        toast({
          title: "Required fields missing",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep === 3) {
      if (user && user.credits < 5) {
        toast({
          title: "Insufficient credits",
          description: "You need at least 5 credits to create a campaign",
          variant: "destructive",
        });
        return;
      }
      
      // Submit campaign (mock)
      toast({
        title: "Campaign created successfully",
        description: "Your campaign has been created and 5 credits have been deducted from your account."
      });
      
      navigate("/dashboard");
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCampaignData({
      ...campaignData,
      [name]: value,
    });
  };

  return (
    <AppLayout activePage="campaigns">
      <div className="p-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" className="mr-2" onClick={handleBack}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Campaign</h1>
            <p className="text-muted-foreground">Let AI help you create a high-converting ad campaign</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-12">
              <StepIndicator number={1} title="Website Analysis" active={currentStep === 1} completed={currentStep > 1} />
              <StepIndicator number={2} title="Campaign Setup" active={currentStep === 2} completed={currentStep > 2} />
              <StepIndicator number={3} title="Platform Selection" active={currentStep === 3} completed={currentStep > 3} />
            </div>
          </div>

          {/* Step 1: Website Analysis */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Website Analysis</CardTitle>
                <CardDescription>
                  Enter your website URL so we can analyze it and suggest campaign settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL</Label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="website"
                          placeholder="https://example.com"
                          className="pl-10"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                        />
                      </div>
                      <Button onClick={() => analyzeWebsite(website)} disabled={isAnalyzing}>
                        {isAnalyzing ? "Analyzing..." : "Analyze"}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-md">
                    <h3 className="text-sm font-medium mb-2">How it works:</h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI will analyze your website to extract key information such as:
                    </p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• Business description and industry</li>
                      <li>• Target audience demographics</li>
                      <li>• Key selling points and value propositions</li>
                      <li>• Brand tone and messaging style</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Campaign Setup */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Campaign Setup</CardTitle>
                <CardDescription>
                  Review and customize your campaign details based on our analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={campaignData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Campaign Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={campaignData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Textarea
                      id="targetAudience"
                      name="targetAudience"
                      rows={2}
                      value={campaignData.targetAudience}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Daily Budget ($)</Label>
                      <Input
                        id="budget"
                        name="budget"
                        type="number"
                        min="5"
                        value={campaignData.budget}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="objective">Campaign Objective</Label>
                      <select
                        id="objective"
                        name="objective"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={campaignData.objective}
                        onChange={(e) => setCampaignData({...campaignData, objective: e.target.value})}
                      >
                        <option value="traffic">Website Traffic</option>
                        <option value="conversions">Conversions</option>
                        <option value="awareness">Brand Awareness</option>
                        <option value="leads">Lead Generation</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Platform Selection */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Platform Selection</CardTitle>
                <CardDescription>
                  Choose where to display your ads and review your campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Tabs defaultValue="google" onValueChange={(value) => setCampaignData({...campaignData, platform: value})}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="google">Google Ads</TabsTrigger>
                      <TabsTrigger value="meta">Meta Ads</TabsTrigger>
                    </TabsList>
                    <TabsContent value="google" className="pt-4">
                      <div className="bg-muted/50 p-4 rounded-md">
                        <h3 className="font-medium mb-2">Google Search Ads</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Your ads will appear on Google Search results when people search for relevant terms.
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Text-based ads on Google search results</li>
                          <li>• Keyword-targeted advertising</li>
                          <li>• High intent traffic from active searchers</li>
                          <li>• Cost: 5 credits (includes AI-generated ad copies)</li>
                        </ul>
                      </div>
                    </TabsContent>
                    <TabsContent value="meta" className="pt-4">
                      <div className="bg-muted/50 p-4 rounded-md">
                        <h3 className="font-medium mb-2">Meta Ads (Facebook & Instagram)</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Your ads will appear on Facebook and Instagram feeds, stories, and more.
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Image and text ads on Facebook & Instagram</li>
                          <li>• Demographic and interest-based targeting</li>
                          <li>• Wide reach and engagement opportunities</li>
                          <li>• Cost: 5 credits (includes AI-generated images & copy)</li>
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
                    <h3 className="text-green-800 font-medium flex items-center gap-2">
                      <Check size={16} className="text-green-600" />
                      Campaign Review
                    </h3>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Name:</span>
                        <span>{campaignData.name}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Platform:</span>
                        <span>{campaignData.platform === 'google' ? 'Google Ads' : 'Meta Ads'}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Budget:</span>
                        <span>${campaignData.budget}/day</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Objective:</span>
                        <span>{campaignData.objective}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Credit cost:</span>
                        <span>5 credits (You have {user?.credits || 0} credits)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleBack}>
              {currentStep === 1 ? "Cancel" : "Back"}
            </Button>
            <Button onClick={handleNext}>
              {currentStep === 3 ? "Create Campaign" : "Next Step"}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

// Step indicator component
const StepIndicator = ({ 
  number, 
  title, 
  active, 
  completed 
}: { 
  number: number; 
  title: string; 
  active: boolean; 
  completed: boolean; 
}) => {
  return (
    <div className="flex items-center">
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 
        ${active ? "bg-brand-600 text-white" : ""} 
        ${completed ? "bg-green-600 text-white" : ""} 
        ${!active && !completed ? "border-2 border-muted-foreground/30 text-muted-foreground" : ""}`}
      >
        {completed ? <Check size={20} /> : number}
      </div>
      <span className={`${active ? "font-medium" : ""} ${completed ? "font-medium" : ""}`}>
        {title}
      </span>
    </div>
  );
};

export default CreateCampaignPage;
