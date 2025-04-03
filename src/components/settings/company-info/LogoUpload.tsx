
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import { CompanyInfo } from "@/types/supabase";

interface LogoUploadProps {
  companyInfo: CompanyInfo;
  onUpdate: (field: keyof CompanyInfo, value: string) => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemove: () => Promise<void>;
  isUploading: boolean;
}

const LogoUpload: React.FC<LogoUploadProps> = ({
  companyInfo,
  onUpload,
  onRemove,
  isUploading
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Logo</h3>
      
      <div className="flex items-start gap-4">
        <div className="h-24 w-24 border rounded-md flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900">
          {companyInfo.logo_url ? (
            <img 
              src={companyInfo.logo_url} 
              alt="Company Logo" 
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <ImagePlus className="h-8 w-8 text-gray-400" />
          )}
        </div>
        
        <div className="space-y-2">
          <Label>Upload Logo (Recommended: 500x500px, PNG/SVG)</Label>
          
          <div className="flex flex-col xs:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('logo-upload')?.click()}
              disabled={isUploading}
              className="relative"
            >
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <div className="h-5 w-5 border-t-2 border-current rounded-full animate-spin"></div>
                </div>
              )}
              <ImagePlus className="mr-2 h-4 w-4" />
              {companyInfo.logo_url ? "Change Logo" : "Upload Logo"}
            </Button>
            
            {companyInfo.logo_url && (
              <Button 
                variant="outline" 
                onClick={onRemove}
                disabled={isUploading}
              >
                <Trash className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}
            
            <input
              id="logo-upload"
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              onChange={onUpload}
              style={{ display: 'none' }}
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            This logo will be used in your generated content
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoUpload;
