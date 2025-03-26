
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, AlertCircle } from "lucide-react";
import PromptTemplates from "./PromptTemplates";

interface ImageGenerationTabProps {
  testAd: MetaAd;
  adTheme: string;
  imageFormat: string;
  isGenerating: boolean;
  onAdChange: (field: keyof MetaAd, value: string) => void;
  onAdThemeChange: (value: string) => void;
  onImageFormatChange: (value: string) => void;
  onGenerateImage: () => Promise<void>;
}

const ImageGenerationTab: React.FC<ImageGenerationTabProps> = ({
  testAd,
  adTheme,
  imageFormat,
  isGenerating,
  onAdChange,
  onAdThemeChange,
  onImageFormatChange,
  onGenerateImage
}) => {
  const promptLength = testAd.imagePrompt?.length || 0;
  const isPromptTooLong = promptLength > 800; // Leave some room for additional context
  
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="imagePrompt">Image Prompt</Label>
          <span className={`text-xs ${isPromptTooLong ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
            {promptLength}/800 characters
          </span>
        </div>
        
        <Textarea 
          id="imagePrompt" 
          value={testAd.imagePrompt || ''}
          onChange={(e) => onAdChange('imagePrompt', e.target.value)}
          placeholder="Describe the image you want to generate..."
          rows={5}
          className={isPromptTooLong ? 'border-red-500' : ''}
        />
        
        {isPromptTooLong && (
          <div className="flex gap-2 items-center mt-1 text-xs text-red-500">
            <AlertCircle size={14} />
            <span>Prompt is too long. Please shorten it to avoid generation errors.</span>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-1">
          Keep prompts concise for better results. OpenAI has a 1000 character limit for prompts, and we add context automatically.
        </p>
      </div>
      
      <PromptTemplates onSelectPrompt={(prompt) => onAdChange('imagePrompt', prompt)} />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="adTheme">Ad Theme</Label>
          <Select value={adTheme} onValueChange={onAdThemeChange}>
            <SelectTrigger id="adTheme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Innovation & Technology">Innovation & Technology</SelectItem>
              <SelectItem value="Leadership">Leadership</SelectItem>
              <SelectItem value="Growth">Growth</SelectItem>
              <SelectItem value="Collaboration">Collaboration</SelectItem>
              <SelectItem value="Success">Success</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="imageFormat">Image Format</Label>
          <Select value={imageFormat} onValueChange={onImageFormatChange}>
            <SelectTrigger id="imageFormat">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Square (1:1)</SelectItem>
              <SelectItem value="landscape">Landscape (1.91:1)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        onClick={onGenerateImage} 
        disabled={isGenerating || !testAd.imagePrompt || isPromptTooLong}
        className="w-full group relative overflow-hidden"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <span className="relative flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          {isGenerating ? 'Generating Image...' : 'Generate LinkedIn Ad Image'}
        </span>
      </Button>
    </div>
  );
};

export default ImageGenerationTab;
