
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

// LinkedIn-specific business themes
const businessThemes = [
  "Innovation & Technology",
  "Leadership & Management",
  "Digital Transformation",
  "Professional Services",
  "Business Growth",
  "Data Analytics",
  "Enterprise Solutions",
  "B2B Marketing",
  "Talent Acquisition",
  "Corporate Training"
];

// LinkedIn-specific industries
const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Manufacturing",
  "Professional Services",
  "Marketing & Advertising",
  "Education",
  "Real Estate",
  "Telecommunications",
  "SaaS"
];

interface LinkedInAdFormProps {
  testAd: MetaAd;
  companyInfo: WebsiteAnalysisResult;
  industry: string;
  adTheme: string;
  imageFormat: string;
  isGenerating: boolean;
  onCompanyNameChange: (value: string) => void;
  onAdChange: (field: keyof MetaAd, value: string) => void;
  onIndustryChange: (value: string) => void;
  onAdThemeChange: (value: string) => void;
  onImageFormatChange: (value: string) => void;
  onGenerateImage: () => Promise<void>;
  onReset: () => void;
}

const LinkedInAdForm: React.FC<LinkedInAdFormProps> = ({
  testAd,
  companyInfo,
  industry,
  adTheme,
  imageFormat,
  isGenerating,
  onCompanyNameChange,
  onAdChange,
  onIndustryChange,
  onAdThemeChange,
  onImageFormatChange,
  onGenerateImage,
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
          placeholder="Your Business"
        />
      </div>

      <IndustryThemeSelectors 
        industry={industry}
        adTheme={adTheme}
        onIndustryChange={onIndustryChange}
        onAdThemeChange={onAdThemeChange}
      />

      <div>
        <Label htmlFor="imageFormat">Image Format</Label>
        <Select
          value={imageFormat}
          onValueChange={onImageFormatChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Image Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="square">Square (1080×1080) - Best for Mobile</SelectItem>
            <SelectItem value="landscape">Landscape (1200×627) - Standard</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-xs text-muted-foreground mt-1">
          Square format tends to perform better on mobile devices
        </div>
      </div>

      <AdTextFields 
        testAd={testAd}
        onAdChange={onAdChange}
      />

      <div>
        <Label htmlFor="imagePrompt">Image Prompt</Label>
        <Textarea
          id="imagePrompt"
          value={testAd.imagePrompt}
          onChange={(e) => onAdChange('imagePrompt', e.target.value)}
          placeholder="Describe the professional LinkedIn image you want to generate..."
          rows={3}
        />
        <div className="flex justify-between mt-2">
          <Button 
            onClick={onGenerateImage} 
            disabled={isGenerating || !testAd.imagePrompt}
            variant="default"
          >
            {isGenerating ? "Generating..." : "Generate LinkedIn Image"}
          </Button>
          <Button onClick={onReset} variant="outline">Reset to Default</Button>
        </div>
      </div>
    </div>
  );
};

interface IndustryThemeSelectorsProps {
  industry: string;
  adTheme: string;
  onIndustryChange: (value: string) => void;
  onAdThemeChange: (value: string) => void;
}

const IndustryThemeSelectors: React.FC<IndustryThemeSelectorsProps> = ({
  industry,
  adTheme,
  onIndustryChange,
  onAdThemeChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="industry">Industry</Label>
        <Select
          value={industry}
          onValueChange={onIndustryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((ind) => (
              <SelectItem key={ind} value={ind}>{ind}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="adTheme">Ad Theme</Label>
        <Select
          value={adTheme}
          onValueChange={onAdThemeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Theme" />
          </SelectTrigger>
          <SelectContent>
            {businessThemes.map((theme) => (
              <SelectItem key={theme} value={theme}>{theme}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

interface AdTextFieldsProps {
  testAd: MetaAd;
  onAdChange: (field: keyof MetaAd, value: string) => void;
}

const AdTextFields: React.FC<AdTextFieldsProps> = ({ testAd, onAdChange }) => {
  return (
    <>
      <div>
        <Label htmlFor="headline">Headline</Label>
        <Input
          id="headline"
          value={testAd.headline}
          onChange={(e) => onAdChange('headline', e.target.value)}
          maxLength={150}
        />
        <div className="text-xs text-muted-foreground mt-1">
          {testAd.headline.length}/150 characters
        </div>
      </div>

      <div>
        <Label htmlFor="primaryText">Primary Text</Label>
        <Textarea
          id="primaryText"
          value={testAd.primaryText}
          onChange={(e) => onAdChange('primaryText', e.target.value)}
          maxLength={600}
          rows={4}
        />
        <div className="text-xs text-muted-foreground mt-1">
          {testAd.primaryText.length}/600 characters
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={testAd.description}
          onChange={(e) => onAdChange('description', e.target.value)}
          maxLength={600}
          rows={2}
        />
        <div className="text-xs text-muted-foreground mt-1">
          {testAd.description.length}/600 characters
        </div>
      </div>
    </>
  );
};

export default LinkedInAdForm;
