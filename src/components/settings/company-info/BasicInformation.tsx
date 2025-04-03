
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompanyInfo } from "@/types/supabase";

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

interface BasicInformationProps {
  companyInfo: CompanyInfo;
  onUpdate: (field: keyof CompanyInfo, value: string) => void;
}

const BasicInformation: React.FC<BasicInformationProps> = ({ 
  companyInfo, 
  onUpdate 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name *</Label>
          <Input
            id="company-name"
            value={companyInfo.company_name}
            onChange={(e) => onUpdate("company_name", e.target.value)}
            placeholder="Your Company Inc."
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Website URL</Label>
          <Input
            id="website"
            value={companyInfo.website || ""}
            onChange={(e) => onUpdate("website", e.target.value)}
            placeholder="https://yourcompany.com"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select 
            value={companyInfo.industry || ""} 
            onValueChange={(value) => onUpdate("industry", value)}
          >
            <SelectTrigger id="industry">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
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
            onChange={(e) => onUpdate("target_market", e.target.value)}
            placeholder="Small businesses, enterprise, etc."
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
