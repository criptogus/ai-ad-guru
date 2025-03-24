
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Check, Loader2 } from "lucide-react";

const industryOptions = [
  "Technology",
  "E-commerce",
  "Finance",
  "Healthcare",
  "Education",
  "Real Estate",
  "Retail",
  "Manufacturing",
  "Marketing & Advertising",
  "Entertainment",
  "Travel & Hospitality",
  "Other"
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "pt", label: "Portuguese" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" }
];

const toneOptions = [
  { value: "professional", label: "Professional", example: "Trusted by enterprises." },
  { value: "conversational", label: "Conversational", example: "Let's grow your business together." },
  { value: "fun", label: "Fun", example: "Marketing made easy and awesome!" },
  { value: "bold", label: "Bold", example: "Dominate your market with AI." },
  { value: "custom", label: "Custom", example: "" }
];

const companyInfoSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  industry: z.string().min(1, "Please select an industry"),
  targetMarket: z.string().optional(),
  language: z.string().min(1, "Please select a language"),
  toneOfVoice: z.string().min(1, "Please select a tone of voice"),
  customTone: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Please enter a valid hex color").optional(),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Please enter a valid hex color").optional()
});

type CompanyInfoValues = z.infer<typeof companyInfoSchema>;

const CompanyInfoSettings: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);

  const form = useForm<CompanyInfoValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      companyName: "",
      website: "",
      industry: "",
      targetMarket: "",
      language: "en",
      toneOfVoice: "professional",
      customTone: "",
      primaryColor: "#4F46E5",
      secondaryColor: "#10B981"
    }
  });

  const selectedTone = form.watch("toneOfVoice");

  // Fetch company info on component mount
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('company_info')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          form.reset({
            companyName: data.company_name || "",
            website: data.website || "",
            industry: data.industry || "",
            targetMarket: data.target_market || "",
            language: data.language || "en",
            toneOfVoice: data.tone_of_voice || "professional",
            customTone: data.custom_tone || "",
            primaryColor: data.primary_color || "#4F46E5",
            secondaryColor: data.secondary_color || "#10B981"
          });
          
          if (data.logo_url) {
            setLogoPreview(data.logo_url);
          }
        }
      } catch (error) {
        console.error("Error fetching company info:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanyInfo();
  }, [user]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo file must be less than 2MB");
        return;
      }
      
      // Check file type
      if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
        toast.error("Only PNG, JPEG, and SVG files are allowed");
        return;
      }
      
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile || !user) return null;
    
    setLogoUploading(true);
    try {
      const fileExt = logoFile.name.split('.').pop();
      const filePath = `company_logos/${user.id}/${Date.now()}.${fileExt}`;
      
      // Check if storage bucket exists, create if not
      const { error: storageError } = await supabase.storage.getBucket('company_assets');
      if (storageError) {
        await supabase.storage.createBucket('company_assets', {
          public: false
        });
      }
      
      const { error: uploadError } = await supabase.storage
        .from('company_assets')
        .upload(filePath, logoFile, {
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('company_assets')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo");
      return null;
    } finally {
      setLogoUploading(false);
    }
  };

  const onSubmit = async (data: CompanyInfoValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      let logoUrl = logoPreview;
      
      // Upload logo if there's a new one
      if (logoFile) {
        const uploadedUrl = await uploadLogo();
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        }
      }
      
      const { error } = await supabase
        .from('company_info')
        .upsert({
          user_id: user.id,
          company_name: data.companyName,
          website: data.website || null,
          industry: data.industry,
          target_market: data.targetMarket || null,
          language: data.language,
          tone_of_voice: data.toneOfVoice,
          custom_tone: data.toneOfVoice === 'custom' ? data.customTone : null,
          logo_url: logoUrl,
          primary_color: data.primaryColor || null,
          secondary_color: data.secondaryColor || null,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success("Company information saved successfully");
    } catch (error) {
      console.error("Error saving company info:", error);
      toast.error("Failed to save company information");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>
          Define your brand identity to be used throughout the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Logo */}
                <div className="space-y-2 col-span-full">
                  <Label htmlFor="logo">Company Logo</Label>
                  <div className="flex items-start gap-4">
                    <div className="h-24 w-24 rounded-md border flex items-center justify-center overflow-hidden bg-muted">
                      {logoPreview ? (
                        <img 
                          src={logoPreview} 
                          alt="Company Logo" 
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No logo
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input 
                        id="logo" 
                        type="file" 
                        accept=".png,.jpg,.jpeg,.svg"
                        onChange={handleLogoChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Recommended: 500x500px, PNG/SVG. Max size: 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Company Name */}
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Website */}
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Industry */}
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {industryOptions.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Target Market */}
                <FormField
                  control={form.control}
                  name="targetMarket"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Market</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Small businesses, B2B, etc." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Language */}
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languageOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tone of Voice */}
                <FormField
                  control={form.control}
                  name="toneOfVoice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone of Voice</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {toneOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedTone !== "custom" && (
                        <FormDescription>
                          Example: {toneOptions.find(t => t.value === selectedTone)?.example}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Custom Tone (conditional) */}
                {selectedTone === "custom" && (
                  <FormField
                    control={form.control}
                    name="customTone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Tone Description</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Describe your brand's tone of voice" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Brand Color</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="color" 
                      id="primaryColor"
                      className="w-12 h-10 p-1"
                      {...form.register("primaryColor")}
                    />
                    <Input 
                      type="text" 
                      className="flex-1"
                      {...form.register("primaryColor")}
                    />
                  </div>
                  {form.formState.errors.primaryColor && (
                    <p className="text-sm text-destructive">{form.formState.errors.primaryColor.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary / Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="color" 
                      id="secondaryColor"
                      className="w-12 h-10 p-1"
                      {...form.register("secondaryColor")}
                    />
                    <Input 
                      type="text" 
                      className="flex-1"
                      {...form.register("secondaryColor")}
                    />
                  </div>
                  {form.formState.errors.secondaryColor && (
                    <p className="text-sm text-destructive">{form.formState.errors.secondaryColor.message}</p>
                  )}
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || logoUploading}
              className="w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoSettings;
