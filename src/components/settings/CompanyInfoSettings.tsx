
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ImagePlus, Trash, Save, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { CompanyInfo } from "@/types/supabase";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const INDUSTRY_OPTIONS = [
  "Software & Technology",
  "Marketing & Advertising",
  "E-commerce & Retail",
  "Healthcare & Wellness",
  "Finance & Insurance",
  "Education & Training",
  "Professional Services",
  "Travel & Hospitality",
  "Manufacturing",
  "Real Estate",
  "Media & Entertainment",
  "Non-profit & NGO",
  "Other"
];

const LANGUAGE_OPTIONS = [
  "English",
  "Spanish",
  "Portuguese",
  "French",
  "German",
  "Italian",
  "Dutch",
  "Chinese",
  "Japanese",
  "Korean",
  "Russian",
  "Arabic",
  "Other"
];

const TONE_OPTIONS = [
  "Professional",
  "Conversational",
  "Fun",
  "Bold",
  "Custom"
];

const TONE_EXAMPLES = {
  Professional: "Trusted by enterprises worldwide.",
  Conversational: "Let's grow your business together!",
  Fun: "Marketing made easy and awesome!",
  Bold: "Dominate your market with AI.",
  Custom: "Create your own tone of voice."
};

const CompanyInfoSettings: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form fields
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    id: "",
    user_id: "",
    company_name: "",
    website: "",
    industry: "",
    target_market: "",
    language: "English",
    tone_of_voice: "Professional",
    custom_tone: "",
    primary_color: "#0070f3",
    secondary_color: "",
    logo_url: "",
    created_at: "",
    updated_at: ""
  });
  
  useEffect(() => {
    if (user) {
      fetchCompanyInfo();
    }
  }, [user]);
  
  const fetchCompanyInfo = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("company_info")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "row not found" error
          throw error;
        }
        // If not found, we'll use the default empty state
      } else if (data) {
        // Cast the data to our CompanyInfo type
        const companyData = data as unknown as CompanyInfo;
        setCompanyInfo({
          ...companyData,
          primary_color: companyData.primary_color || "#0070f3",
          language: companyData.language || "English",
          tone_of_voice: companyData.tone_of_voice || "Professional"
        });
      }
    } catch (error) {
      console.error("Error fetching company info:", error);
      toast({
        title: "Failed to load company information",
        description: "There was an error loading your company details"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Special handling for tone of voice
    if (field === 'tone_of_voice' && value !== 'Custom') {
      setCompanyInfo(prev => ({
        ...prev,
        custom_tone: ''
      }));
    }
  };
  
  const handleSave = async () => {
    if (!user) return;
    
    // Validation
    if (!companyInfo.company_name.trim()) {
      toast({
        title: "Company name required",
        description: "Please enter your company name"
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      const updateData = {
        user_id: user.id,
        company_name: companyInfo.company_name,
        website: companyInfo.website,
        industry: companyInfo.industry,
        target_market: companyInfo.target_market,
        language: companyInfo.language,
        tone_of_voice: companyInfo.tone_of_voice,
        custom_tone: companyInfo.custom_tone,
        primary_color: companyInfo.primary_color,
        secondary_color: companyInfo.secondary_color,
        logo_url: companyInfo.logo_url
      };
      
      let result;
      
      if (companyInfo.id) {
        // Update existing record
        result = await supabase
          .from("company_info")
          .update(updateData)
          .eq("id", companyInfo.id)
          .eq("user_id", user.id);
      } else {
        // Insert new record
        result = await supabase
          .from("company_info")
          .insert([updateData]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: "Changes saved",
        description: "Your company information has been updated"
      });
      
      // Refresh data
      fetchCompanyInfo();
      
    } catch (error) {
      console.error("Error saving company info:", error);
      toast({
        title: "Failed to save changes",
        description: "There was an error updating your company information"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    
    // Validate file type
    const fileType = file.type;
    if (!fileType.match(/image\/(png|jpeg|jpg|svg\+xml)/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG, JPG, or SVG image"
      });
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Logo image must be less than 2MB"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExt}`;
      const filePath = `logos/${user.id}/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("company")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("company")
        .getPublicUrl(filePath);
      
      // Update company info with logo URL
      setCompanyInfo(prev => ({
        ...prev,
        logo_url: publicUrl
      }));
      
      toast({
        title: "Logo uploaded",
        description: "Your company logo has been uploaded"
      });
      
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your logo"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveLogo = async () => {
    if (!companyInfo.logo_url || !user) return;
    
    try {
      // Remove from storage if it's in our bucket
      if (companyInfo.logo_url.includes('supabase')) {
        const path = companyInfo.logo_url.split('/').slice(-2).join('/');
        await supabase.storage.from("company").remove([`logos/${path}`]);
      }
      
      // Update company info to remove logo URL
      setCompanyInfo(prev => ({
        ...prev,
        logo_url: ""
      }));
      
      toast({
        title: "Logo removed",
        description: "Your company logo has been removed"
      });
      
    } catch (error) {
      console.error("Error removing logo:", error);
      toast({
        title: "Failed to remove logo",
        description: "There was an error removing your logo"
      });
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Loading your company details...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>
          Define your brand identity for AI-generated content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <Separator className="flex-1" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name *</Label>
              <Input
                id="company-name"
                value={companyInfo.company_name}
                onChange={(e) => handleInputChange("company_name", e.target.value)}
                placeholder="Your Company Inc."
                required
                className="input-focus"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                value={companyInfo.website || ""}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://yourcompany.com"
                className="input-focus"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select 
                value={companyInfo.industry || ""} 
                onValueChange={(value) => handleInputChange("industry", value)}
              >
                <SelectTrigger id="industry" className="focus-ring">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {INDUSTRY_OPTIONS.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target-market">Target Market</Label>
              <Input
                id="target-market"
                value={companyInfo.target_market || ""}
                onChange={(e) => handleInputChange("target_market", e.target.value)}
                placeholder="Small businesses, enterprise, etc."
                className="input-focus"
              />
            </div>
          </div>
        </div>
        
        {/* Logo Upload */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Logo</h3>
            <Separator className="flex-1" />
          </div>
          
          <div className="flex items-start gap-6">
            <div className="h-24 w-24 border rounded-lg flex items-center justify-center overflow-hidden bg-muted">
              {companyInfo.logo_url ? (
                <img 
                  src={companyInfo.logo_url} 
                  alt="Company Logo" 
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            
            <div className="space-y-3 flex-1">
              <Label>Upload Logo (Recommended: 500x500px, PNG/SVG)</Label>
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  disabled={isUploading}
                  className="relative focus-ring"
                >
                  {isUploading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {!isUploading && <ImagePlus className="mr-2 h-4 w-4" />}
                  {companyInfo.logo_url ? "Change Logo" : "Upload Logo"}
                </Button>
                
                {companyInfo.logo_url && (
                  <Button 
                    variant="outline" 
                    onClick={handleRemoveLogo}
                    disabled={isUploading}
                    className="text-destructive hover:text-destructive focus-ring"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                )}
                
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                />
              </div>
              
              <p className="text-sm text-muted-foreground">
                This logo will be used in your AI-generated ad creatives
              </p>
            </div>
          </div>
        </div>
        
        {/* Content Style */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Content Style</h3>
            <Separator className="flex-1" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs text-primary px-2 py-1 bg-primary/10 rounded-full">AI-Important</div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">These settings significantly impact how AI generates your ad content</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select 
                value={companyInfo.language || "English"} 
                onValueChange={(value) => handleInputChange("language", value)}
              >
                <SelectTrigger id="language" className="focus-ring">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {LANGUAGE_OPTIONS.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tone">Tone of Voice</Label>
              <Select 
                value={companyInfo.tone_of_voice || "Professional"} 
                onValueChange={(value) => handleInputChange("tone_of_voice", value)}
              >
                <SelectTrigger id="tone" className="focus-ring">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {TONE_OPTIONS.map((tone) => (
                    <SelectItem key={tone} value={tone}>
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {companyInfo.tone_of_voice && companyInfo.tone_of_voice !== "Custom" && (
                <p className="text-xs text-muted-foreground mt-1.5">
                  Example: "{TONE_EXAMPLES[companyInfo.tone_of_voice as keyof typeof TONE_EXAMPLES]}"
                </p>
              )}
            </div>
          </div>
          
          {companyInfo.tone_of_voice === "Custom" && (
            <div className="space-y-2 mt-2">
              <Label htmlFor="custom-tone">Custom Tone Description</Label>
              <Textarea
                id="custom-tone"
                value={companyInfo.custom_tone || ""}
                onChange={(e) => handleInputChange("custom_tone", e.target.value)}
                placeholder="Describe your brand's unique tone of voice..."
                className="min-h-[100px] input-focus"
              />
            </div>
          )}
        </div>
        
        {/* Brand Colors */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Brand Colors</h3>
            <Separator className="flex-1" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-3 items-center">
                <div 
                  className="h-10 w-10 rounded-md border"
                  style={{ backgroundColor: companyInfo.primary_color || "#0070f3" }}
                />
                <Input
                  id="primary-color"
                  type="color"
                  value={companyInfo.primary_color || "#0070f3"}
                  onChange={(e) => handleInputChange("primary_color", e.target.value)}
                  className="w-full h-10 input-focus cursor-pointer"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color (Optional)</Label>
              <div className="flex gap-3 items-center">
                <div 
                  className="h-10 w-10 rounded-md border"
                  style={{ backgroundColor: companyInfo.secondary_color || "" }}
                />
                <Input
                  id="secondary-color"
                  type="color"
                  value={companyInfo.secondary_color || "#ffffff"}
                  onChange={(e) => handleInputChange("secondary_color", e.target.value)}
                  className="w-full h-10 input-focus cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !companyInfo.company_name.trim()}
            className="min-w-[120px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoSettings;
