
import React from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CompanyInfoTabProps {
  companyInfo: WebsiteAnalysisResult;
  industry: string;
  onCompanyNameChange: (value: string) => void;
  onIndustryChange: (value: string) => void;
  onReset: () => void;
}

const CompanyInfoTab: React.FC<CompanyInfoTabProps> = ({
  companyInfo,
  industry,
  onCompanyNameChange,
  onIndustryChange,
  onReset
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input 
          id="companyName" 
          value={companyInfo.companyName} 
          onChange={(e) => onCompanyNameChange(e.target.value)}
          placeholder="e.g., Acme Corporation"
        />
      </div>
      
      <div>
        <Label htmlFor="industry">Industry</Label>
        <Select value={industry} onValueChange={onIndustryChange}>
          <SelectTrigger id="industry">
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
            <SelectItem value="Retail">Retail</SelectItem>
            <SelectItem value="Professional Services">Professional Services</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button variant="outline" onClick={onReset}>
        Reset to Defaults
      </Button>
    </div>
  );
};

export default CompanyInfoTab;
