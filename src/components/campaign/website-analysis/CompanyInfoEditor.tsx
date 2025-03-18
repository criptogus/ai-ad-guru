
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface CompanyInfoEditorProps {
  analysisResult: WebsiteAnalysisResult;
  onTextChange: (field: keyof WebsiteAnalysisResult, value: string) => void;
}

const CompanyInfoEditor: React.FC<CompanyInfoEditorProps> = ({
  analysisResult,
  onTextChange
}) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <h4 className="font-medium text-gray-700 mb-2">Company Information</h4>
      <div className="space-y-4">
        <div>
          <Label htmlFor="companyName" className="text-sm font-medium text-gray-500">Company Name</Label>
          <Input
            id="companyName"
            value={analysisResult.companyName}
            onChange={(e) => onTextChange('companyName', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="businessDescription" className="text-sm font-medium text-gray-500">Business Description</Label>
          <Textarea
            id="businessDescription"
            value={analysisResult.businessDescription}
            onChange={(e) => onTextChange('businessDescription', e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="brandTone" className="text-sm font-medium text-gray-500">Brand Tone</Label>
          <Input
            id="brandTone"
            value={analysisResult.brandTone}
            onChange={(e) => onTextChange('brandTone', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoEditor;
