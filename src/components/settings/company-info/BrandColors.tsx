
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CompanyInfo } from "@/types/supabase";

interface BrandColorsProps {
  companyInfo: CompanyInfo;
  onUpdate: (field: keyof CompanyInfo, value: string) => void;
}

const BrandColors: React.FC<BrandColorsProps> = ({
  companyInfo,
  onUpdate
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Brand Colors</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="primary-color">Primary Color</Label>
          <div className="flex gap-2">
            <div 
              className="h-10 w-10 rounded-md border"
              style={{ backgroundColor: companyInfo.primary_color || "#0070f3" }}
            />
            <Input
              id="primary-color"
              type="color"
              value={companyInfo.primary_color || "#0070f3"}
              onChange={(e) => onUpdate("primary_color", e.target.value)}
              className="w-full h-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="secondary-color">Secondary Color (Optional)</Label>
          <div className="flex gap-2">
            <div 
              className="h-10 w-10 rounded-md border"
              style={{ backgroundColor: companyInfo.secondary_color || "" }}
            />
            <Input
              id="secondary-color"
              type="color"
              value={companyInfo.secondary_color || "#ffffff"}
              onChange={(e) => onUpdate("secondary_color", e.target.value)}
              className="w-full h-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandColors;
