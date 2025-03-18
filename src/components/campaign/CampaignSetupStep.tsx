
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CampaignSetupProps {
  analysisResult: WebsiteAnalysisResult;
  campaignData: any;
  onUpdateCampaignData: (data: any) => void;
  onBack: () => void;
  onNext: () => void;
}

// List of languages for the dropdown
const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
];

// List of countries for the dropdown
const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "MX", name: "Mexico" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "AU", name: "Australia" },
  { code: "BR", name: "Brazil" },
  { code: "IN", name: "India" },
];

const CampaignSetupStep: React.FC<CampaignSetupProps> = ({
  analysisResult,
  campaignData,
  onUpdateCampaignData,
  onBack,
  onNext,
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [isGeneratingTargeting, setIsGeneratingTargeting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Pre-fill the campaign data from the analysis result if not already set
    if (analysisResult && !campaignData.name) {
      onUpdateCampaignData({
        ...campaignData,
        name: `${analysisResult.companyName} Campaign`,
        description: analysisResult.businessDescription,
        targetAudience: analysisResult.targetAudience,
        // Default values for new fields
        targetUrl: analysisResult.websiteUrl || "",
        language: "en",
        country: "US",
        device: ["desktop", "mobile", "tablet"],
        bidStrategy: "maximize_conversions",
        ageRange: "18-65+",
        gender: "all",
      });
    }
  }, [analysisResult, campaignData, onUpdateCampaignData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdateCampaignData({
      ...campaignData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    onUpdateCampaignData({
      ...campaignData,
      [name]: value,
    });
  };

  const handleMultiSelectChange = (name: string, value: string) => {
    const currentValues = Array.isArray(campaignData[name]) ? campaignData[name] : [];
    
    if (currentValues.includes(value)) {
      // Remove the value if it's already selected
      onUpdateCampaignData({
        ...campaignData,
        [name]: currentValues.filter((v: string) => v !== value),
      });
    } else {
      // Add the value if it's not already selected
      onUpdateCampaignData({
        ...campaignData,
        [name]: [...currentValues, value],
      });
    }
  };

  // Function to generate AI-based targeting recommendations
  const generateTargetingRecommendations = async () => {
    if (!analysisResult) {
      toast({
        title: "Missing Data",
        description: "Website analysis data is required to generate targeting recommendations",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingTargeting(true);
    try {
      console.log('Starting targeting recommendation generation with data:', {
        businessDescription: analysisResult.businessDescription,
        targetAudience: analysisResult.targetAudience,
      });
      
      // Call Supabase edge function to generate targeting recommendations
      const { data, error } = await supabase.functions.invoke('generate-targeting', {
        body: { 
          businessDescription: analysisResult.businessDescription,
          targetAudience: analysisResult.targetAudience,
          keywords: analysisResult.keywords,
          brandTone: analysisResult.brandTone,
          uniqueSellingPoints: analysisResult.uniqueSellingPoints
        },
      });

      console.log('Response from generate-targeting:', { data, error });

      if (error) {
        console.error('Error generating targeting recommendations:', error);
        throw error;
      }

      if (!data.success) {
        console.error('Targeting recommendation generation failed:', data.error);
        throw new Error(data.error || "Failed to generate targeting recommendations");
      }

      console.log('Successfully generated targeting recommendations:', data.data);

      // Update the campaign data with the AI recommendations
      onUpdateCampaignData({
        ...campaignData,
        ...data.data
      });
      
      toast({
        title: "Targeting Generated",
        description: "AI-based targeting recommendations have been applied",
      });
      
      // Switch to targeting tab to show the generated recommendations
      setActiveTab("targeting");
      
    } catch (error) {
      console.error('Error generating targeting recommendations:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate targeting recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTargeting(false);
    }
  };

  const isDeviceSelected = (device: string) => {
    return Array.isArray(campaignData.device) && campaignData.device.includes(device);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Setup</CardTitle>
        <CardDescription>
          Review and customize your campaign details based on the AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button 
            onClick={generateTargetingRecommendations} 
            disabled={isGeneratingTargeting}
            className="w-full"
            variant="outline"
          >
            {isGeneratingTargeting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating targeting recommendations...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate AI Targeting Recommendations
              </>
            )}
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="targeting">Targeting</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                name="name"
                value={campaignData.name || ""}
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
                value={campaignData.description || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetUrl">Target URL</Label>
              <Input
                id="targetUrl"
                name="targetUrl"
                type="url"
                placeholder="https://example.com/landing-page"
                value={campaignData.targetUrl || ""}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                The landing page where users will be directed after clicking your ad
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Daily Budget ($)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  min="5"
                  value={campaignData.budget || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="objective">Campaign Objective</Label>
                <Select 
                  value={campaignData.objective || ""} 
                  onValueChange={(value) => handleSelectChange("objective", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="traffic">Website Traffic</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="awareness">Brand Awareness</SelectItem>
                    <SelectItem value="leads">Lead Generation</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="app_installs">App Installs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="targeting" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                name="targetAudience"
                rows={2}
                value={campaignData.targetAudience || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={campaignData.language || "en"} 
                  onValueChange={(value) => handleSelectChange("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select 
                  value={campaignData.country || "US"} 
                  onValueChange={(value) => handleSelectChange("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Devices</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                <Button
                  type="button"
                  variant={isDeviceSelected("desktop") ? "default" : "outline"}
                  onClick={() => handleMultiSelectChange("device", "desktop")}
                  className="text-xs"
                >
                  Desktop
                </Button>
                <Button
                  type="button"
                  variant={isDeviceSelected("mobile") ? "default" : "outline"}
                  onClick={() => handleMultiSelectChange("device", "mobile")}
                  className="text-xs"
                >
                  Mobile
                </Button>
                <Button
                  type="button"
                  variant={isDeviceSelected("tablet") ? "default" : "outline"}
                  onClick={() => handleMultiSelectChange("device", "tablet")}
                  className="text-xs"
                >
                  Tablet
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ageRange">Age Range</Label>
                <Select 
                  value={campaignData.ageRange || "18-65+"} 
                  onValueChange={(value) => handleSelectChange("ageRange", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-24">18-24</SelectItem>
                    <SelectItem value="25-34">25-34</SelectItem>
                    <SelectItem value="35-44">35-44</SelectItem>
                    <SelectItem value="45-54">45-54</SelectItem>
                    <SelectItem value="55-64">55-64</SelectItem>
                    <SelectItem value="65+">65+</SelectItem>
                    <SelectItem value="18-65+">All Ages (18+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={campaignData.gender || "all"} 
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locations">Specific Locations (Optional)</Label>
              <Textarea
                id="locations"
                name="locations"
                rows={2}
                placeholder="Enter specific cities, states or regions, separated by commas"
                value={campaignData.locations || ""}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to target the entire country
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests & Behaviors (Meta Ads)</Label>
              <Textarea
                id="interests"
                name="interests"
                rows={2}
                placeholder="Enter interests to target, separated by commas"
                value={campaignData.interests || ""}
                onChange={handleInputChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bidStrategy">Bid Strategy</Label>
              <Select 
                value={campaignData.bidStrategy || "maximize_conversions"} 
                onValueChange={(value) => handleSelectChange("bidStrategy", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bid strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maximize_conversions">Maximize Conversions</SelectItem>
                  <SelectItem value="maximize_clicks">Maximize Clicks</SelectItem>
                  <SelectItem value="target_cpa">Target CPA</SelectItem>
                  <SelectItem value="target_roas">Target ROAS</SelectItem>
                  <SelectItem value="manual_cpc">Manual CPC</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How Google Ads will optimize your bidding
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={campaignData.startDate || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={campaignData.endDate || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exclusions">Keyword Exclusions (Optional)</Label>
              <Textarea
                id="exclusions"
                name="exclusions"
                rows={2}
                placeholder="Enter keywords to exclude, separated by commas"
                value={campaignData.exclusions || ""}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Keywords you want to exclude from your targeting
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-4 border-t flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignSetupStep;
