
// Define the AdFormat type that will be used across the app
export type AdFormat = 'square' | 'portrait' | 'landscape' | 'story' | 'horizontal';

// Define the format mappings for image generation
export type GenerationFormat = 'square' | 'portrait' | 'landscape' | 'story' | 'horizontal';

// Map UI format names to generation format names
export const formatMapping: Record<AdFormat, GenerationFormat> = {
  'square': 'square',
  'portrait': 'portrait',
  'landscape': 'landscape',
  'story': 'story',
  'horizontal': 'horizontal'
};

// Function to get the aspect ratio based on format
export function getAspectRatio(format: AdFormat): string {
  switch (format) {
    case 'square':
      return '1:1';
    case 'portrait':
      return '4:5';
    case 'landscape':
    case 'horizontal':
      return '16:9';
    case 'story':
      return '9:16';
    default:
      return '1:1';
  }
}

// Map of format name to dimensions
export const formatDimensions = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  landscape: { width: 1200, height: 627 },
  horizontal: { width: 1200, height: 627 },
  story: { width: 1080, height: 1920 }
};
