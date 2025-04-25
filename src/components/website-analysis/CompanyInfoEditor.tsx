
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
  // Standard industry categories (ensure this matches the list in analyze-website edge function)
  const industries = [
    "Education", "Healthcare", "Technology", "Finance", "Retail", 
    "Manufacturing", "Marketing", "Real Estate", "Travel", "Food & Beverage",
    "Consulting", "Entertainment", "Energy", "Agriculture", "Arts",
    "Automotive", "Media", "Pharmaceuticals", "Telecommunications", "Transportation",
    "Professional Services", "Non-Profit", "Government", "Sports", "Fitness",
    "Beauty", "Fashion"
  ];

  // Common brand tone options
  const brandTones = [
    "Professional", "Friendly", "Authoritative", "Playful", "Innovative",
    "Luxurious", "Empathetic", "Educational", "Inspirational", "Casual"
  ];

  // Current industry value from analysis (ensure proper capitalization)
  const currentIndustry = analysisResult?.industry || "";
  
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
          className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
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
            onTextChange('businessDescription', value);
            onTextChange('companyDescription' as keyof WebsiteAnalysisResult, value);
          }}
          className="w-full resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
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
          Industry / Segment
        </Label>
        <Select
          value={currentIndustry.toLowerCase()}
          onValueChange={(value) => onTextChange('industry', value)}
        >
          <SelectTrigger className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 max-h-[300px]">
            {industries.map((industry) => (
              <SelectItem key={industry.toLowerCase()} value={industry.toLowerCase()}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          If the detected industry isn't correct, please select the most appropriate one
        </p>
      </div>
      
      <div>
        <Label htmlFor="brand-tone" className="block text-sm font-medium mb-1">
          Brand Tone
        </Label>
        <Select
          value={analysisResult.brandTone?.toLowerCase() || ''}
          onValueChange={(value) => onTextChange('brandTone', value)}
        >
          <SelectTrigger className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
            <SelectValue placeholder="Select brand tone" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800">
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
          onChange={(e) => onTextChange('targetAudience', e.target.value)}
          className="w-full resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          rows={3}
          placeholder="Describe the target audience demographics, interests, and pain points"
          required
        />
      </div>
    </div>
  );
};

export default CompanyInfoEditor;
