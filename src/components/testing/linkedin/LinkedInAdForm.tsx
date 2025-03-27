
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { PromptTemplate } from "@/hooks/template/usePromptTemplates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PromptTemplates from "./PromptTemplates";
import AdFormFields from "./AdFormFields";
import AdFormActions from "./AdFormActions";
import ImagePromptField from "./ImagePromptField";
import TemplateVariablesForm from "./TemplateVariablesForm";
import { useForm, FormProvider } from "react-hook-form";

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
  const [activeTab, setActiveTab] = useState("form");
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [mainText, setMainText] = useState("");
  const [subText, setSubText] = useState("");
  
  // Create a form instance that we'll provide to child components
  const methods = useForm({
    defaultValues: {
      headline: testAd.headline || "",
      primaryText: testAd.primaryText || "",
      description: testAd.description || "",
      imagePrompt: testAd.imagePrompt || "",
      companyName: companyInfo.companyName || "",
      industry: industry,
      adTheme: adTheme,
      imageFormat: imageFormat
    }
  });

  const handleSelectTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    
    const mainTextMatch = template.prompt_text.match(/\${mainText:([^}]*)}/);
    const subTextMatch = template.prompt_text.match(/\${subText:([^}]*)}/);
    
    if (mainTextMatch && mainTextMatch[1]) {
      setMainText(mainTextMatch[1]);
    }
    
    if (subTextMatch && subTextMatch[1]) {
      setSubText(subTextMatch[1]);
    }
    
    onAdChange("imagePrompt", template.prompt_text);
    
    // Update ad details based on the template category
    const templateCategory = template.category || "professional";
    const adDetails = getCategoryAdDetails(templateCategory);
    onAdChange("headline", adDetails.headline);
    onAdChange("primaryText", adDetails.primaryText);
    onAdChange("description", adDetails.description);
    
    setActiveTab("form");
  };

  const getCategoryAdDetails = (category: string): { headline: string; primaryText: string; description: string } => {
    const adDetailsMap: Record<string, { headline: string; primaryText: string; description: string }> = {
      "professional": {
        headline: "Take Your Career to the Next Level",
        primaryText: "Join industry leaders who've transformed their professional trajectory with our solutions. Discover how our platform can enhance your skill set and open new opportunities.",
        description: "Learn More"
      },
      "recruitment": {
        headline: "We're Hiring Top Talent",
        primaryText: "Join our growing team of professionals making an impact. We offer competitive benefits, flexible work arrangements, and career growth opportunities.",
        description: "Apply Now"
      },
      "b2b": {
        headline: "Streamline Your Business Operations",
        primaryText: "Our enterprise solution helps businesses reduce costs by 30% while improving productivity. Join 500+ companies already seeing results.",
        description: "Request Demo"
      },
      "event": {
        headline: "Join Our Upcoming Webinar",
        primaryText: "Don't miss this opportunity to learn from industry experts and network with professionals in your field. Limited spots available!",
        description: "Register Now"
      }
    };
    
    return adDetailsMap[category] || {
      headline: "Connect With Us on LinkedIn",
      primaryText: "Discover how our solutions can help your business grow. Our team of experts is ready to answer your questions and provide personalized guidance.",
      description: "Connect Now"
    };
  };

  const handleGenerateWithTemplate = async () => {
    if (selectedTemplate) {
      let processedPrompt = selectedTemplate.prompt_text;
      
      if (mainText) {
        processedPrompt = processedPrompt.replace(/\${mainText:[^}]*}/g, mainText);
      }
      
      if (subText) {
        processedPrompt = processedPrompt.replace(/\${subText:[^}]*}/g, subText);
      }
      
      onAdChange("imagePrompt", processedPrompt);
      await onGenerateImage();
    } else {
      await onGenerateImage();
    }
  };

  return (
    <FormProvider {...methods}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="form">Ad Details</TabsTrigger>
          <TabsTrigger value="templates">Template Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card>
            <CardContent className="p-4 pt-5 space-y-4">
              <AdFormFields
                testAd={testAd}
                companyInfo={companyInfo}
                industry={industry}
                adTheme={adTheme}
                imageFormat={imageFormat}
                onCompanyNameChange={onCompanyNameChange}
                onAdChange={onAdChange}
                onIndustryChange={onIndustryChange}
                onAdThemeChange={onAdThemeChange}
                onImageFormatChange={onImageFormatChange}
              />

              {selectedTemplate ? (
                <TemplateVariablesForm
                  selectedTemplate={selectedTemplate}
                  mainText={mainText}
                  subText={subText}
                  setMainText={setMainText}
                  setSubText={setSubText}
                />
              ) : (
                <ImagePromptField
                  prompt={testAd.imagePrompt || ""}
                  onChange={(value) => onAdChange("imagePrompt", value)}
                />
              )}

              <AdFormActions
                isGenerating={isGenerating}
                hasPromptContent={!!testAd.imagePrompt || !!selectedTemplate}
                onGenerate={handleGenerateWithTemplate}
                onReset={onReset}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardContent className="p-4">
              <PromptTemplates onSelectPrompt={(prompt) => {
                onAdChange("imagePrompt", prompt);
                setActiveTab("form");
              }} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FormProvider>
  );
};

export default LinkedInAdForm;
