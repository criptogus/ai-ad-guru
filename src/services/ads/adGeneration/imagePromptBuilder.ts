
interface ImagePromptContext {
  brandName: string;
  productService: string;
  campaignObjective: string;
  targetAudience: string;
  tone: string;
  mentalTrigger?: string;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'google' | 'meta';
  format: 'square' | 'portrait' | 'landscape' | 'story' | 'horizontal';
  brandColors?: string[];
}

export const buildImageGenerationPrompt = ({
  brandName,
  productService,
  campaignObjective,
  targetAudience,
  tone,
  mentalTrigger,
  platform,
  format,
  brandColors = ['#3B82F6', '#10B981']
}: ImagePromptContext): string => {
  const formatDimensions = {
    square: '1080x1080',
    portrait: '1080x1350',
    landscape: '1200x627',
    story: '1080x1920',
    horizontal: '1200x627' // Adding horizontal format with the same dimensions as landscape
  };

  // Map 'meta' platform to 'instagram' for prompt generation
  const displayPlatform = platform === 'meta' ? 'instagram' : platform;

  return `Create a high-resolution advertising image designed for a ${displayPlatform} ad campaign.

### Brand Context:
- Brand name: ${brandName}
- Product/service: ${productService}
- Campaign objective: ${campaignObjective}
- Target audience: ${targetAudience}
- Tone: ${tone}
- Main emotion or mental trigger: ${mentalTrigger || 'trust'}

### Image Style:
- Agency-quality, photorealistic composition
- Cinematic lighting and vibrant colors
- Clean background with strategic negative space for overlays (but no text on image)
- Use the brand colors subtly: ${brandColors.join(', ')}
- Format: ${displayPlatform} ${format} (${formatDimensions[format]})
- Visual focal point: Professional scene showing value proposition, with modern aesthetics

### Requirements:
- No text in the image
- Human figures should look natural and diverse (avoid AI distortions)
- Avoid watermarks or artifacts
- Should immediately convey the value and emotion of the product/service
- Style inspiration: [Apple ads, Nike visuals, fintech dashboards, startup hero banners]`;
};
