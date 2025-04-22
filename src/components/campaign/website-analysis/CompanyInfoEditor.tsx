
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface CompanyInfoEditorProps {
  analysisResult: WebsiteAnalysisResult;
  onTextChange: (field: keyof WebsiteAnalysisResult, value: string) => void;
}

const CompanyInfoEditor: React.FC<CompanyInfoEditorProps> = ({
  analysisResult,
  onTextChange
}) => {
  // Common industries for selection
  const industries = [
    "Technology", "Finance", "Healthcare", "Education", "Retail", 
    "Manufacturing", "Marketing", "Real Estate", "Travel", "Food & Beverage",
    "Professional Services", "Construction", "Entertainment", "Energy", "Agriculture"
  ];

  // Common brand tone options
  const brandTones = [
    "Professional", "Friendly", "Authoritative", "Playful", "Innovative",
    "Luxurious", "Empathetic", "Educational", "Inspirational", "Casual"
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="company-name" className="block text-sm font-medium mb-1">
          Company Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="company-name"
          value={analysisResult.companyName}
          onChange={(e) => onTextChange('companyName', e.target.value)}
          className="w-full"
          placeholder="Enter the company name"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="business-description" className="block text-sm font-medium mb-1">
          Business Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="business-description"
          value={analysisResult.businessDescription || analysisResult.companyDescription || ''}
          onChange={(e) => {
            const value = e.target.value;
            onTextChange('businessDescription' as keyof WebsiteAnalysisResult, value);
            onTextChange('companyDescription' as keyof WebsiteAnalysisResult, value);
          }}
          className="w-full resize-none"
          rows={4}
          placeholder="Describe what the company does, its products/services, and unique selling points"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          This description is crucial for generating relevant ads - be specific and comprehensive
        </p>
      </div>
      
      <div>
        <Label htmlFor="industry" className="block text-sm font-medium mb-1">
          Industry
        </Label>
        <Select
          value={analysisResult.industry || ''}
          onValueChange={(value) => onTextChange('industry' as keyof WebsiteAnalysisResult, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industry) => (
              <SelectItem key={industry.toLowerCase()} value={industry.toLowerCase()}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="brand-tone" className="block text-sm font-medium mb-1">
          Brand Tone
        </Label>
        <Select
          value={analysisResult.brandTone || ''}
          onValueChange={(value) => onTextChange('brandTone' as keyof WebsiteAnalysisResult, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select brand tone" />
          </SelectTrigger>
          <SelectContent>
            {brandTones.map((tone) => (
              <SelectItem key={tone.toLowerCase()} value={tone.toLowerCase()}>
                {tone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="target-audience" className="block text-sm font-medium mb-1">
          Target Audience <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="target-audience"
          value={analysisResult.targetAudience || ''}
          onChange={(e) => onTextChange('targetAudience' as keyof WebsiteAnalysisResult, e.target.value)}
          className="w-full resize-none"
          rows={3}
          placeholder="Describe the target audience demographics, interests, and pain points"
          required
        />
      </div>
    </div>
  );
};

export default CompanyInfoEditor;
