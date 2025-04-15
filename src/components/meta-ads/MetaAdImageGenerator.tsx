
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ImageIcon, Download, Copy, Sparkles } from 'lucide-react';
import { generateMetaAdImage } from '@/services/meta/metaImageGenerator';
import { toast } from 'sonner';
import { useCredits } from '@/contexts/CreditsContext';

const adThemes = [
  { value: 'professional', label: 'Professional & Corporate' },
  { value: 'vibrant', label: 'Vibrant & Colorful' },
  { value: 'minimal', label: 'Minimal & Clean' },
  { value: 'luxury', label: 'Luxury & Elegant' },
  { value: 'playful', label: 'Playful & Fun' },
  { value: 'tech', label: 'Technology & Innovation' },
  { value: 'natural', label: 'Natural & Organic' },
  { value: 'vintage', label: 'Vintage & Retro' }
];

const adFormats = [
  { value: 'square', label: 'Square (1:1) - Feed posts', dimensions: '1080×1080px' },
  { value: 'landscape', label: 'Landscape (1.91:1) - Feed posts', dimensions: '1200×628px' },
  { value: 'portrait', label: 'Portrait (4:5) - Feed posts', dimensions: '1080×1350px' },
  { value: 'story', label: 'Story (9:16) - Stories & Reels', dimensions: '1080×1920px' }
];

const promptTemplates = [
  'Product displayed elegantly on a clean background with brand colors.',
  'Person using product in a lifestyle setting with natural lighting.',
  'Before and after comparison showing product benefits.',
  'Product features displayed with modern, minimalist infographic elements.',
  'Product in an aspirational setting related to its purpose.',
];

const MetaAdImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [format, setFormat] = useState<'square' | 'landscape' | 'portrait' | 'story'>('square');
  const [theme, setTheme] = useState('professional');
  const [brandName, setBrandName] = useState('');
  const [brandColors, setBrandColors] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { deductCredits } = useCredits();

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for your image');
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMessage(null);

      // Create an enhanced prompt with brand information and theme
      let enhancedPrompt = prompt;
      if (brandName) enhancedPrompt += `. Brand: ${brandName}.`;
      if (brandColors) enhancedPrompt += ` Using brand colors: ${brandColors}.`;
      enhancedPrompt += ` Style: ${theme}.`;

      // Charge credits before generating
      const creditCost = 5;
      const creditSuccess = await deductCredits(creditCost);
      
      if (!creditSuccess) {
        toast.error('Not enough credits', {
          description: 'Please purchase more credits to generate images.'
        });
        setIsGenerating(false);
        return;
      }

      // Generate the image
      const result = await generateMetaAdImage({
        prompt: enhancedPrompt,
        format,
        style: theme
      });

      if (!result.success || !result.imageUrl) {
        throw new Error(result.error || 'Failed to generate image');
      }

      setGeneratedImage(result.imageUrl);
      toast.success('Image generated successfully', {
        description: '5 credits have been used for this generation.'
      });
    } catch (error) {
      console.error('Error generating image:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
      
      toast.error('Failed to generate image', {
        description: error instanceof Error ? error.message : 'Please try again with a different prompt'
      });
      
      // Refund credits on failure
      await deductCredits(-5);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateClick = (template: string) => {
    setPrompt(template);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `meta-ad-${new Date().getTime()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Image downloaded successfully');
  };

  const handleCopyUrl = () => {
    if (!generatedImage) return;
    
    navigator.clipboard.writeText(generatedImage);
    toast.success('Image URL copied to clipboard');
  };

  const getFormatDimensions = () => {
    const formatObj = adFormats.find(f => f.value === format);
    return formatObj ? formatObj.dimensions : '1080×1080px';
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="prompt">Image Description</Label>
          <Textarea
            id="prompt"
            placeholder="Describe what you want to see in your ad image..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px]"
          />
          
          <div className="mt-2">
            <p className="text-sm font-medium mb-2">Prompt Templates</p>
            <div className="flex flex-wrap gap-2">
              {promptTemplates.map((template, i) => (
                <button
                  key={i}
                  className="text-xs bg-muted px-3 py-1 rounded-full hover:bg-muted/80"
                  onClick={() => handleTemplateClick(template)}
                >
                  {template.substring(0, 30)}...
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="format">Format</Label>
            <Select value={format} onValueChange={(value: any) => setFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {adFormats.map((formatOption) => (
                  <SelectItem key={formatOption.value} value={formatOption.value}>
                    {formatOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Dimensions: {getFormatDimensions()}</p>
          </div>
          
          <div>
            <Label htmlFor="theme">Visual Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {adThemes.map((themeOption) => (
                  <SelectItem key={themeOption.value} value={themeOption.value}>
                    {themeOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brandName">Brand Name (Optional)</Label>
            <Input
              id="brandName"
              placeholder="Your brand name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="brandColors">Brand Colors (Optional)</Label>
            <Input
              id="brandColors"
              placeholder="e.g., blue and white, #FF5733"
              value={brandColors}
              onChange={(e) => setBrandColors(e.target.value)}
            />
          </div>
        </div>
        
        <Button 
          onClick={handleGenerateImage} 
          disabled={isGenerating || !prompt.trim()} 
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Image (5 Credits)
            </>
          )}
        </Button>
      </div>
      
      <div>
        <p className="text-sm font-medium mb-2">Preview</p>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div 
              className={`aspect-${format === 'square' ? 'square' : format === 'portrait' ? '[4/5]' : format === 'landscape' ? '[1.91/1]' : '[9/16]'} bg-muted flex items-center justify-center relative overflow-hidden`}
            >
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
                  <p className="text-sm font-medium">Generating your image...</p>
                  <p className="text-xs text-muted-foreground mt-1">This might take up to 30 seconds</p>
                </div>
              ) : generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="Generated ad" 
                  className="w-full h-full object-cover"
                  onError={() => {
                    setErrorMessage('Failed to load image. Please try again.');
                    setGeneratedImage(null);
                  }}
                />
              ) : errorMessage ? (
                <div className="flex flex-col items-center justify-center text-center p-4 text-destructive">
                  <p className="text-sm font-medium">Error generating image</p>
                  <p className="text-xs mt-1">{errorMessage}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium">Your image will appear here</p>
                  <p className="text-xs text-muted-foreground mt-1">Fill in the details and click "Generate"</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {generatedImage && (
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleCopyUrl}>
              <Copy className="mr-2 h-4 w-4" />
              Copy URL
            </Button>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Images are generated using OpenAI DALL-E 3 technology and stored securely in Supabase.
          <br />
          Each image generation costs 5 credits.
        </p>
      </div>
    </div>
  );
};

export default MetaAdImageGenerator;
