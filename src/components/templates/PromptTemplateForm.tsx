
import React, { useState } from "react";
import { PromptTemplate } from "@/hooks/template/usePromptTemplates";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface PromptTemplateFormProps {
  template: PromptTemplate | null;
  imageGeneration: any;
  onSelectNewTemplate: () => void;
  companyName: string;
  industry: string;
  brandTone: string;
}

const PromptTemplateForm: React.FC<PromptTemplateFormProps> = ({
  template,
  imageGeneration,
  onSelectNewTemplate,
  companyName,
  industry,
  brandTone
}) => {
  const [mainText, setMainText] = useState('');
  const [subText, setSubText] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleGenerateImage = async () => {
    if (!template) {
      toast({
        title: "No Template Selected",
        description: "Please select a template to generate an image.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to generate images.",
        variant: "destructive",
      });
      return;
    }
    
    if (!companyName || !industry || !brandTone) {
      toast({
        title: "Missing Brand Details",
        description: "Please provide your company name, industry, and brand tone.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Call the generateAdImage function from the useGPT4oImageGeneration hook
      const imageUrl = await imageGeneration.generateAdImage(template.prompt_text, {
        mainText,
        subText,
        companyName,
        industry,
        brandTone
      });
      
      if (imageUrl) {
        setGeneratedImageUrl(imageUrl);
        toast({
          title: "Image Generated Successfully",
          description: "Your ad image has been generated.",
        });
      } else {
        toast({
          title: "Image Generation Failed",
          description: "Failed to generate the ad image.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Image Generation Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="text-lg font-semibold">
          {template ? template.title || "Template" : 'No Template Selected'}
        </h2>
        <p className="text-muted-foreground">
          {template ? template.prompt_text || "No description available" : 'Select a template to start generating images.'}
        </p>
        
        {template && (
          <>
            <div className="space-y-2">
              <Label htmlFor="mainText">Main Text</Label>
              <Input 
                id="mainText" 
                placeholder="Enter main text" 
                value={mainText}
                onChange={(e) => setMainText(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subText">Sub Text</Label>
              <Textarea 
                id="subText" 
                placeholder="Enter sub text" 
                value={subText}
                onChange={(e) => setSubText(e.target.value)}
              />
            </div>
            
            <Button onClick={handleGenerateImage}>
              Generate Image
            </Button>
          </>
        )}
        
        {generatedImageUrl && (
          <div className="mt-4">
            <img 
              src={generatedImageUrl} 
              alt="Generated Ad" 
              className="rounded-md" 
            />
          </div>
        )}
        
        <Button variant="outline" onClick={onSelectNewTemplate}>
          Select New Template
        </Button>
      </CardContent>
    </Card>
  );
};

export default PromptTemplateForm;
