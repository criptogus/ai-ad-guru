import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { useFormContext, Controller } from "react-hook-form";

interface AdFormFieldsProps {
  testAd: MetaAd;
  companyInfo: WebsiteAnalysisResult;
  industry: string;
  adTheme: string;
  imageFormat: "square" | "portrait" | "landscape";
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
  onImageFormatChange,
}) => {
  const { control } = useFormContext();

  const industries = [
    "Technology", "Finance", "Healthcare", "Education", "Retail", 
    "Manufacturing", "Marketing", "Real Estate", "Travel", "Food & Beverage"
  ];

  const adThemes = [
    "Innovation & Technology", "Growth & Success", "Professional Development",
    "Problem Solving", "Networking & Connections", "Industry Leadership",
    "Business Transformation", "Future Trends", "Sustainability"
  ];

  const imageFormats = [
    { value: "square", label: "Square (1:1)" },
    { value: "landscape", label: "Landscape (1.91:1)" },
    { value: "portrait", label: "Portrait (4:5)" }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Controller 
            name="companyName"
            control={control}
            render={({ field }) => (
              <Input 
                id="companyName"
                placeholder="Enter company name"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  onCompanyNameChange(e.target.value);
                }}
              />
            )}
          />
        </div>
        
        <div>
          <Label htmlFor="headline">Headline</Label>
          <Controller 
            name="headline"
            control={control}
            render={({ field }) => (
              <Input 
                id="headline"
                placeholder="Enter headline"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  onAdChange("headline", e.target.value);
                }}
              />
            )}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="primaryText">Primary Text</Label>
        <Controller 
          name="primaryText"
          control={control}
          render={({ field }) => (
            <Input 
              id="primaryText"
              placeholder="Enter primary text"
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
                onAdChange("primaryText", e.target.value);
              }}
            />
          )}
        />
      </div>

      <div>
        <Label htmlFor="description">Description/CTA</Label>
        <Controller 
          name="description"
          control={control}
          render={({ field }) => (
            <Input 
              id="description"
              placeholder="Enter description or call-to-action"
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
                onAdChange("description", e.target.value);
              }}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Controller 
            name="industry"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={(value) => {
                  field.onChange(value);
                  onIndustryChange(value);
                }}
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
            )}
          />
        </div>
        
        <div>
          <Label htmlFor="adTheme">Ad Theme</Label>
          <Controller 
            name="adTheme"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={(value) => {
                  field.onChange(value);
                  onAdThemeChange(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Theme" />
                </SelectTrigger>
                <SelectContent>
                  {adThemes.map((theme) => (
                    <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        
        <div>
          <Label htmlFor="imageFormat">Image Format</Label>
          <Controller 
            name="imageFormat"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={(value) => {
                  field.onChange(value);
                  onImageFormatChange(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Format" />
                </SelectTrigger>
                <SelectContent>
                  {imageFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default AdFormFields;
