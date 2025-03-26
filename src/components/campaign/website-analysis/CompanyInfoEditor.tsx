
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface CompanyInfoEditorProps {
  analysisResult: any;
  onTextChange: (field: string, value: string) => void;
}

const CompanyInfoEditor: React.FC<CompanyInfoEditorProps> = ({
  analysisResult,
  onTextChange
}) => {
  return (
    <div className="bg-card dark:bg-card p-4 rounded-md shadow-sm">
      <h4 className="font-medium text-foreground mb-2">Company Information</h4>
      <div className="space-y-4">
        <div>
          <Label htmlFor="companyName" className="text-sm font-medium text-muted-foreground">Company Name</Label>
          <Input
            id="companyName"
            value={analysisResult.companyName}
            onChange={(e) => onTextChange('companyName', e.target.value)}
            className="mt-1 bg-background dark:bg-background"
          />
        </div>
        <div>
          <Label htmlFor="businessDescription" className="text-sm font-medium text-muted-foreground">Business Description</Label>
          <Textarea
            id="businessDescription"
            value={analysisResult.businessDescription}
            onChange={(e) => onTextChange('businessDescription', e.target.value)}
            className="mt-1 bg-background dark:bg-background"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="brandTone" className="text-sm font-medium text-muted-foreground">Brand Tone</Label>
          <Input
            id="brandTone"
            value={analysisResult.brandTone}
            onChange={(e) => onTextChange('brandTone', e.target.value)}
            className="mt-1 bg-background dark:bg-background"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoEditor;
