
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

export interface CompanyInfoEditorProps {
  analysisResult: WebsiteAnalysisResult;
  onTextChange: (field: keyof WebsiteAnalysisResult, value: string) => void;
}

const CompanyInfoEditor: React.FC<CompanyInfoEditorProps> = ({
  analysisResult,
  onTextChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="company-name" className="block text-sm font-medium mb-1">
          Company Name
        </label>
        <Input
          id="company-name"
          value={analysisResult.companyName}
          onChange={(e) => onTextChange('companyName', e.target.value)}
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="business-description" className="block text-sm font-medium mb-1">
          Business Description
        </label>
        <Textarea
          id="business-description"
          value={analysisResult.businessDescription}
          onChange={(e) => onTextChange('businessDescription', e.target.value)}
          className="w-full resize-none"
          rows={3}
        />
      </div>
      
      <div>
        <label htmlFor="brand-tone" className="block text-sm font-medium mb-1">
          Brand Tone
        </label>
        <Input
          id="brand-tone"
          value={analysisResult.brandTone}
          onChange={(e) => onTextChange('brandTone', e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default CompanyInfoEditor;
