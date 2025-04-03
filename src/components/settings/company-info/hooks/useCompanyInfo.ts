
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CompanyInfo } from "@/types/supabase";

export const useCompanyInfo = () => {
  const { toast } = useToast();
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
  
  // Load company info on component mount
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
        description: "There was an error loading your company details",
        variant: "destructive",
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
        description: "Please enter your company name",
        variant: "destructive",
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
        description: "Your company information has been updated",
      });
      
      // Refresh data
      fetchCompanyInfo();
      
    } catch (error) {
      console.error("Error saving company info:", error);
      toast({
        title: "Failed to save changes",
        description: "There was an error updating your company information",
        variant: "destructive",
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
        description: "Please upload a PNG, JPG, or SVG image",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Logo image must be less than 2MB",
        variant: "destructive",
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
        description: "Your company logo has been uploaded",
      });
      
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your logo",
        variant: "destructive",
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
        description: "Your company logo has been removed",
      });
      
    } catch (error) {
      console.error("Error removing logo:", error);
      toast({
        title: "Failed to remove logo",
        description: "There was an error removing your logo",
        variant: "destructive",
      });
    }
  };
  
  return {
    companyInfo,
    isLoading,
    isSaving,
    isUploading,
    handleInputChange,
    handleSave,
    handleLogoUpload,
    handleRemoveLogo
  };
};
