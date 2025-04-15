
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  getFormatOptions, 
  getStyleOptions, 
  getIndustryOptions,
  adFormats,
  estimateGenerationCost
} from '@/services/media/metaAdImageGenerator';
import { useMetaAdImageGeneration } from '@/hooks/adGeneration/useMetaAdImageGeneration';
import { Loader2, Download, Copy, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';

interface MetaAdImageGeneratorProps {
  initialBrandName?: string;
  initialIndustry?: string;
  initialTargetAudience?: string;
  initialBrandColors?: string;
}

const MetaAdImageGenerator: React.FC<MetaAdImageGeneratorProps> = ({
  initialBrandName = '',
  initialIndustry = '',
  initialTargetAudience = '',
  initialBrandColors = ''
}) => {
  // Format and style options
  const formatOptions = getFormatOptions();
  const styleOptions = getStyleOptions();
  const industryOptions = getIndustryOptions();
  
  // Form state
  const [format, setFormat] = useState<string>('square');
  const [style, setStyle] = useState<string>('professional');
  const [industry, setIndustry] = useState<string>(initialIndustry);
  const [brandName, setBrandName] = useState<string>(initialBrandName);
  const [brandColors, setBrandColors] = useState<string>(initialBrandColors);
  const [targetAudience, setTargetAudience] = useState<string>(initialTargetAudience);
  const [prompt, setPrompt] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('generator');
  
  // Meta Ad image generation hook
  const { generateImage, isGenerating, lastGenerated, error } = useMetaAdImageGeneration();
  
  // Cost estimation
  const costEstimate = estimateGenerationCost(prompt);
  
  // Get the current format dimensions
  const getCurrentFormatDimensions = () => {
    const formatData = adFormats[format as keyof typeof adFormats];
    if (formatData) {
      return `${formatData.width} × ${formatData.height}px`;
    }
    return '1080 × 1080px';
  };
  
  // Handle prompt suggestions
  const handleSuggestion = (suggestionText: string) => {
    setPrompt(suggestionText);
  };
  
  // Handle image generation
  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter an image description");
      return;
    }
    
    // Generate the image
    await generateImage({
      basePrompt: prompt,
      format: format as any,
      style,
      industry,
      brandName,
      brandColors,
      targetAudience
    });
    
    // Switch to the preview tab after generation
    if (lastGenerated) {
      setActiveTab('preview');
    }
  };
  
  // Handle image download
  const handleDownload = () => {
    if (!lastGenerated?.url) return;
    
    // Create a temporary link
    const a = document.createElement('a');
    a.href = lastGenerated.url;
    a.download = `meta-ad-${new Date().getTime()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Image downloaded successfully");
  };
  
  // Handle prompt copy
  const handleCopyPrompt = () => {
    if (!lastGenerated?.prompt) return;
    
    navigator.clipboard.writeText(lastGenerated.prompt)
      .then(() => {
        toast.success("Enhanced prompt copied to clipboard");
      })
      .catch(err => {
        console.error('Could not copy text:', err);
        toast.error("Failed to copy prompt");
      });
  };
  
  return (
    <div className="container">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">Image Generator</TabsTrigger>
          <TabsTrigger value="preview" disabled={!lastGenerated}>Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Options panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Ad Image Options</CardTitle>
                <CardDescription>Configure your Meta ad image settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ad-format">Ad Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger id="ad-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {formatOptions.map(option => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {getCurrentFormatDimensions()}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ad-style">Visual Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="ad-style">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {styleOptions.map(option => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry (Optional)</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No specific industry</SelectItem>
                      {industryOptions.map(option => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Brand Name (Optional)</Label>
                  <Input 
                    id="brand-name" 
                    value={brandName} 
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Your brand name" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand-colors">Brand Colors (Optional)</Label>
                  <Input 
                    id="brand-colors" 
                    value={brandColors} 
                    onChange={(e) => setBrandColors(e.target.value)}
                    placeholder="e.g., blue and white, #FF5733" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="target-audience">Target Audience (Optional)</Label>
                  <Input 
                    id="target-audience" 
                    value={targetAudience} 
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., young professionals, parents" 
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Image description and preview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Image Description</CardTitle>
                <CardDescription>
                  Describe the image you want to generate for your ad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-prompt">Image Description</Label>
                  <Textarea 
                    id="image-prompt" 
                    value={prompt} 
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={5} 
                    placeholder="Describe the image you want to generate..." 
                    className="resize-none"
                  />
                  
                  <div className="bg-muted/30 p-3 rounded-md mt-2">
                    <p className="text-sm font-medium mb-2">Suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSuggestion("Product being used by a satisfied customer in a natural environment with soft lighting.")}
                        className="text-xs"
                      >
                        Product in use
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSuggestion("Comparison of before and after results showing clear benefits.")}
                        className="text-xs"
                      >
                        Before/After
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSuggestion("Person demonstrating a problem that the product solves with frustrated expression.")}
                        className="text-xs"
                      >
                        Problem/Solution
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-muted-foreground">
                      Est. cost: {costEstimate.credits} credits
                    </div>
                    <Button 
                      onClick={handleGenerateImage} 
                      disabled={isGenerating || !prompt.trim()}
                      className="min-w-[150px]"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <ImagePlus className="mr-2 h-4 w-4" />
                          Generate Image
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {error && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          {lastGenerated ? (
            <Card>
              <CardHeader>
                <CardTitle>Generated Ad Image</CardTitle>
                <CardDescription>
                  Here's your generated Meta/Instagram ad image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-4">
                    <div className="border rounded-md overflow-hidden bg-muted/20 flex items-center justify-center" style={{
                      aspectRatio: format === 'story' ? '9/16' : format === 'portrait' ? '4/5' : format === 'landscape' ? '1.91/1' : '1/1',
                    }}>
                      <img 
                        src={lastGenerated.url} 
                        alt="Generated Ad"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={handleDownload} className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button onClick={handleCopyPrompt} variant="outline" className="flex-1">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Prompt
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Preview: Instagram Post</Label>
                      <div className="border rounded-md p-4 bg-white dark:bg-gray-900">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          <div>
                            <div className="text-sm font-medium">{brandName || 'yourbrand'}</div>
                            <div className="text-xs text-muted-foreground">Sponsored</div>
                          </div>
                        </div>
                        <div 
                          className="w-full rounded-md overflow-hidden mb-3"
                          style={{
                            aspectRatio: format === 'portrait' ? '4/5' : '1/1',
                            backgroundImage: `url(${lastGenerated.url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        ></div>
                        <div className="flex justify-between mb-2">
                          <div className="flex space-x-4">
                            <span>♥</span>
                            <span>💬</span>
                            <span>▸</span>
                          </div>
                          <span>⊕</span>
                        </div>
                        <div className="text-sm font-medium mb-1">123 likes</div>
                        <div className="text-sm">
                          <span className="font-medium mr-1">{brandName || 'yourbrand'}</span>
                          Your ad copy will appear here. Keep it engaging and concise.
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Original Prompt</Label>
                      <div className="text-sm p-3 border rounded-md bg-muted/20 max-h-[150px] overflow-y-auto">
                        {lastGenerated.originalPrompt}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Enhanced Prompt Used</Label>
                      <div className="text-sm p-3 border rounded-md bg-muted/20 max-h-[150px] overflow-y-auto">
                        {lastGenerated.prompt}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setActiveTab('generator')}>
                    Back to Generator
                  </Button>
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
                        <ImagePlus className="mr-2 h-4 w-4" />
                        Generate New Image
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-10">
                <div className="text-center">
                  <p>No image has been generated yet. Go to the Generator tab to create an image.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('generator')} 
                    className="mt-4"
                  >
                    Go to Generator
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MetaAdImageGenerator;
