
/**
 * FallbackImageService - Provides reliable fallback images when image generation/loading fails
 */

type FallbackFormat = 'square' | 'portrait' | 'landscape' | 'story' | 'reel';

/**
 * Generate a dynamic SVG fallback image with customizable text
 */
export const createSvgFallback = (
  message: string = "Image Unavailable", 
  bgColor: string = "#f0f0f0", 
  textColor: string = "#666666",
  format: FallbackFormat = "square"
): string => {
  // Determine dimensions based on format
  const width = 100;
  const height = format === 'square' ? 100 : 
                 format === 'portrait' || format === 'story' || format === 'reel' ? 178 : 
                 56; // landscape
  
  const viewBox = `0 0 ${width} ${height}`;
  
  // Create SVG string
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">
      <rect width="${width}" height="${height}" fill="${bgColor}"/>
      <text x="${width/2}" y="${height/2}" font-family="Arial" font-size="8" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${message}</text>
    </svg>
  `;
  
  // Encode the SVG
  const encodedSvg = encodeURIComponent(svg);
  return `data:image/svg+xml,${encodedSvg}`;
};

/**
 * Create a data URI for a fallback image with platform branding
 */
export const getPlatformPlaceholder = (
  platform: 'instagram' | 'linkedin' | 'facebook' | 'google',
  message: string = "Image Not Available",
  format: FallbackFormat = "square"
): string => {
  // Platform-specific colors
  const colors = {
    instagram: { bg: "#f8f9fa", text: "#dd2a7b" },
    linkedin: { bg: "#f8f9fa", text: "#0077b5" },
    facebook: { bg: "#f8f9fa", text: "#1877f2" },
    google: { bg: "#f8f9fa", text: "#4285f4" }
  };
  
  const { bg, text } = colors[platform];
  
  return createSvgFallback(`${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${message}`, bg, text, format);
};

/**
 * Creates a loading placeholder SVG
 */
export const getLoadingPlaceholder = (format: FallbackFormat = "square"): string => {
  const width = 100;
  const height = format === 'square' ? 100 : 
               format === 'portrait' || format === 'story' || format === 'reel' ? 178 : 
               56; // landscape
  
  // Simple animated loading indicator SVG
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="#f8f9fa"/>
      <circle cx="${width/2}" cy="${height/2}" r="10" fill="none" stroke="#cccccc" stroke-width="2"/>
      <path d="M ${width/2} ${height/2-10} A 10 10 0 0 1 ${width/2+10} ${height/2}" stroke="#666666" stroke-width="2" fill="none"/>
      <text x="${width/2}" y="${height/2+20}" font-family="Arial" font-size="8" fill="#666666" text-anchor="middle">Loading...</text>
    </svg>
  `;
  
  const encodedSvg = encodeURIComponent(svg);
  return `data:image/svg+xml,${encodedSvg}`;
};

/**
 * Get a fallback image URL using Via Placeholder (more reliable than many placeholder services)
 */
export const getPlaceholderImageUrl = (
  width: number = 400, 
  height: number = 400, 
  bgColor: string = "f8f9fa", 
  textColor: string = "666666", 
  text: string = "Image Unavailable"
): string => {
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
};

export default {
  createSvgFallback,
  getPlatformPlaceholder,
  getLoadingPlaceholder,
  getPlaceholderImageUrl
};
