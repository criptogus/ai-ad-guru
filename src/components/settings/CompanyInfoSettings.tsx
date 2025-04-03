
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BasicInformation from "./company-info/BasicInformation";
import LogoUpload from "./company-info/LogoUpload";
import ContentStyle from "./company-info/ContentStyle";
import BrandColors from "./company-info/BrandColors";
import { useCompanyInfo } from "./company-info/hooks/useCompanyInfo";

const CompanyInfoSettings: React.FC = () => {
  const { 
    companyInfo,
    isLoading,
    isSaving,
    isUploading,
    handleInputChange,
    handleSave,
    handleLogoUpload,
    handleRemoveLogo
  } = useCompanyInfo();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Loading your company details...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="h-8 w-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
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
      <CardContent className="space-y-6">
        {/* Basic Information Section */}
        <BasicInformation 
          companyInfo={companyInfo} 
          onUpdate={handleInputChange} 
        />
        
        {/* Logo Upload Section */}
        <LogoUpload 
          companyInfo={companyInfo} 
          onUpdate={handleInputChange}
          onUpload={handleLogoUpload}
          onRemove={handleRemoveLogo}
          isUploading={isUploading}
        />
        
        {/* Content Style Section */}
        <ContentStyle 
          companyInfo={companyInfo} 
          onUpdate={handleInputChange} 
        />
        
        {/* Brand Colors Section */}
        <BrandColors 
          companyInfo={companyInfo} 
          onUpdate={handleInputChange} 
        />
        
        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !companyInfo.company_name.trim()}
            className="min-w-[120px]"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 border-t-2 border-current rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoSettings;
