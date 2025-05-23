
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface AdFormFieldsProps {
  testAd: MetaAd;
  companyInfo: WebsiteAnalysisResult;
  industry: string;
  adTheme: string;
  imageFormat: "square" | "portrait" | "landscape"; // Using union type instead of string
  onCompanyNameChange: (value: string) => void;
  onAdChange: (field: keyof MetaAd, value: string) => void;
  onIndustryChange: (value: string) => void;
  onAdThemeChange: (value: string) => void;
  onImageFormatChange: (value: string) => void;
}

const AdFormFields: React.FC<AdFormFieldsProps> = ({
  testAd,
  companyInfo,
  industry,
  adTheme,
  imageFormat,
  onCompanyNameChange,
  onAdChange,
  onIndustryChange,
  onAdThemeChange,
  onImageFormatChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={companyInfo.companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          placeholder="Enter company name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="headline">Headline</Label>
        <Input
          id="headline"
          value={testAd.headline || ""}
          onChange={(e) => onAdChange("headline", e.target.value)}
          placeholder="Enter headline (150 characters max)"
          maxLength={150}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="primaryText">Primary Text</Label>
        <Textarea
          id="primaryText"
          value={testAd.primaryText || ""}
          onChange={(e) => onAdChange("primaryText", e.target.value)}
          placeholder="Enter primary ad text (600 characters max)"
          maxLength={600}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description / CTA</Label>
        <Input
          id="description"
          value={testAd.description || ""}
          onChange={(e) => onAdChange("description", e.target.value)}
          placeholder="Enter description or call to action (150 characters max)"
          maxLength={150}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select value={industry} onValueChange={onIndustryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Retail">Retail</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme">Ad Theme</Label>
        <Select value={adTheme} onValueChange={onAdThemeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select ad theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Innovation & Technology">Innovation & Technology</SelectItem>
            <SelectItem value="Professional & Corporate">Professional & Corporate</SelectItem>
            <SelectItem value="Trustworthy & Reliable">Trustworthy & Reliable</SelectItem>
            <SelectItem value="Growth & Success">Growth & Success</SelectItem>
            <SelectItem value="Leadership & Vision">Leadership & Vision</SelectItem>
            <SelectItem value="Team & Collaboration">Team & Collaboration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="format">Image Format</Label>
        <Select value={imageFormat} onValueChange={onImageFormatChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select image format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="square">Square (1:1)</SelectItem>
            <SelectItem value="landscape">Landscape (16:9)</SelectItem>
            <SelectItem value="portrait">Portrait (4:5)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default AdFormFields;
