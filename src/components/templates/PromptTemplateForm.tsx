
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image as ImageIcon, RotateCw } from 'lucide-react';
import { PromptTemplate } from '@/hooks/template/usePromptTemplates';
import { UseGPT4oImageGenerationReturn } from '@/hooks/adGeneration/useGPT4oImageGeneration';

interface TemplateFormProps {
  template: PromptTemplate | null;
  imageGeneration: UseGPT4oImageGenerationReturn;
  onSelectNewTemplate: () => void;
  onImageGenerated?: (imageUrl: string) => void;
  companyName?: string;
  industry?: string;
  brandTone?: string;
  campaignId?: string;
}

const PromptTemplateForm: React.FC<TemplateFormProps> = ({
  template,
  imageGeneration,
  onSelectNewTemplate,
  onImageGenerated,
  companyName = '',
  industry = '',
  brandTone = 'professional',
  campaignId
}) => {
  const [mainText, setMainText] = useState<string>('');
  const [subText, setSubText] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [useCustomPrompt, setUseCustomPrompt] = useState<boolean>(false);
  
  const { generateImage, isGenerating, lastGeneratedImageUrl, lastError } = imageGeneration;
  
  // Extract default values from template when it changes
  useEffect(() => {
    if (template) {
      // Extract default values from template placeholders
      const mainTextMatch = template.prompt_text.match(/\${mainText:([^}]*)}/);
      const subTextMatch = template.prompt_text.match(/\${subText:([^}]*)}/);
      
      setMainText(mainTextMatch ? mainTextMatch[1] : '');
      setSubText(subTextMatch ? subTextMatch[1] : '');
      setCustomPrompt(template.prompt_text);
      setUseCustomPrompt(false);
    }
  }, [template]);
  
  const handleGenerateImage = async () => {
    if (useCustomPrompt) {
      const imageUrl = await generateImage({
        promptTemplate: customPrompt,
        companyName,
        industry,
        brandTone,
        campaignId
      });
      
      if (imageUrl && onImageGenerated) {
        onImageGenerated(imageUrl);
      }
    } else if (template) {
      const imageUrl = await generateImage({
        templateId: template.id,
        mainText,
        subText,
        companyName,
        industry,
        brandTone,
        campaignId
      });
      
      if (imageUrl && onImageGenerated) {
        onImageGenerated(imageUrl);
      }
    }
  };
  
  if (!template && !useCustomPrompt) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Template Selected</CardTitle>
          <CardDescription>
            Please select a template from the gallery or create a custom prompt.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={onSelectNewTemplate}>
            Select Template
          </Button>
          <Button 
            variant="outline" 
            className="ml-2"
            onClick={() => setUseCustomPrompt(true)}
          >
            Create Custom Prompt
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {useCustomPrompt ? 'Custom Prompt' : template?.title}
        </CardTitle>
        <CardDescription>
          {useCustomPrompt 
            ? 'Create your own custom prompt for image generation'
            : `Category: ${template?.category}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {useCustomPrompt ? (
          <div className="space-y-2">
            <Label htmlFor="customPrompt">Custom Prompt</Label>
            <Textarea
              id="customPrompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={6}
              placeholder="Write your custom prompt here..."
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Pro tip: Use clear, descriptive language for the best results.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="mainText">Main Text</Label>
              <Input
                id="mainText"
                value={mainText}
                onChange={(e) => setMainText(e.target.value)}
                placeholder="Main headline for the image"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subText">Sub Text</Label>
              <Input
                id="subText"
                value={subText}
                onChange={(e) => setSubText(e.target.value)}
                placeholder="Secondary text or call to action"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateText">Template Text</Label>
              <Textarea
                id="templateText"
                value={template?.prompt_text}
                rows={3}
                readOnly
                className="resize-none bg-muted"
              />
            </div>
          </>
        )}
        
        {lastGeneratedImageUrl && (
          <div className="mt-4">
            <Label>Generated Image</Label>
            <div className="mt-2 border rounded-md overflow-hidden">
              <img 
                src={lastGeneratedImageUrl} 
                alt="Generated ad" 
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        )}
        
        {lastError && (
          <div className="text-sm text-destructive mt-2">
            Error: {lastError}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => {
            if (useCustomPrompt) {
              setUseCustomPrompt(false);
              onSelectNewTemplate();
            } else {
              onSelectNewTemplate();
            }
          }}
        >
          {useCustomPrompt ? 'Cancel' : 'Change Template'}
        </Button>
        <div className="space-x-2">
          {!useCustomPrompt && (
            <Button 
              variant="outline" 
              onClick={() => setUseCustomPrompt(true)}
            >
              Edit Full Prompt
            </Button>
          )}
          <Button 
            onClick={handleGenerateImage} 
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                {lastGeneratedImageUrl ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Generate Image
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PromptTemplateForm;
