
import { AdTemplate } from './TemplateGallery';

const adTemplates: AdTemplate[] = [
  // Instagram/Meta Ad Templates
  {
    id: "meta-lifestyle-1",
    name: "Lifestyle Product Usage",
    description: "Show your product being used in a natural, lifestyle setting",
    prompt: "Create a lifestyle image of people naturally using ${mainText:your product} in a bright, airy environment with soft lighting. Show genuine enjoyment and authentic interaction.",
    category: "lifestyle",
    format: "feed",
    tags: ["lifestyle", "product", "natural"],
    platform: "instagram"
  },
  {
    id: "meta-before-after",
    name: "Before & After Results",
    description: "Demonstrate the transformation or benefits of your product",
    prompt: "Create a split image showing a before and after transformation with ${mainText:your product's results}. Make the contrast clear but realistic, showing authentic results.",
    category: "product-focus",
    format: "feed",
    tags: ["results", "comparison", "transformation"],
    platform: "instagram"
  },
  {
    id: "meta-problem-solution",
    name: "Problem & Solution",
    description: "Show a common problem and how your product solves it",
    prompt: "Show a person struggling with ${mainText:a common problem} with a frustrated expression, then demonstrate how your product provides an elegant solution with a satisfied result.",
    category: "product-focus",
    format: "feed",
    tags: ["problem", "solution", "benefit"],
    platform: "instagram"
  },
  {
    id: "meta-minimalist",
    name: "Minimalist Product Showcase",
    description: "Clean, minimal product display on simple background",
    prompt: "Create a minimalist product showcase for ${mainText:your product} on a clean, simple background with subtle shadows. Focus on the product's design with ample negative space.",
    category: "minimal",
    format: "feed",
    tags: ["minimal", "clean", "product"],
    platform: "instagram"
  },
  {
    id: "meta-story-vertical",
    name: "Instagram Story Template",
    description: "Vertical format optimized for Instagram Stories",
    prompt: "Create a vertical Instagram Story image featuring ${mainText:your product or message}. Design with ample space at top and bottom for text overlays. Use vibrant colors and eye-catching visuals.",
    category: "social",
    format: "story",
    tags: ["story", "vertical", "vibrant"],
    platform: "instagram"
  },
  {
    id: "meta-carousel-1",
    name: "Product Feature Carousel",
    description: "Showcase different features in a carousel-friendly format",
    prompt: "Create a square image highlighting ${mainText:a specific feature} of your product against a clean background. Design with consistent style suitable for a carousel post.",
    category: "product-focus",
    format: "feed",
    tags: ["carousel", "features", "product"],
    platform: "instagram"
  },
  {
    id: "meta-ugc-style",
    name: "UGC-Style Testimonial",
    description: "Authentic user-generated content style",
    prompt: "Create an authentic-looking image showing a real person using ${mainText:your product} in a casual, non-professional setting. Should look like genuine user-generated content with natural lighting.",
    category: "lifestyle",
    format: "feed",
    tags: ["UGC", "authentic", "testimonial"],
    platform: "instagram"
  },
  // Google Ad Templates
  {
    id: "google-service-1",
    name: "Service Offering",
    description: "Professional representation of your service",
    prompt: "Create a professional image representing ${mainText:your service} with clean, corporate styling and subtle branding elements.",
    category: "professional",
    tags: ["service", "professional", "corporate"],
    platform: "google"
  },
  {
    id: "google-product-1",
    name: "Product Showcase",
    description: "Clean product display for Google Ads",
    prompt: "Create a clean, professional image of ${mainText:your product} on a simple background with excellent lighting and product details clearly visible.",
    category: "product-focus",
    tags: ["product", "clean", "showcase"],
    platform: "google"
  },
  {
    id: "google-local-1",
    name: "Local Business",
    description: "Highlight your local business location",
    prompt: "Create an image representing a local ${mainText:type of business} with a welcoming storefront, clear signage, and approachable atmosphere.",
    category: "local",
    tags: ["local", "business", "storefront"],
    platform: "google"
  },
  // LinkedIn Ad Templates
  {
    id: "linkedin-professional-1",
    name: "Professional B2B",
    description: "Corporate and professional image for B2B marketing",
    prompt: "Create a professional corporate image representing ${mainText:your B2B service or product} with business professionals in a modern office environment.",
    category: "professional",
    tags: ["B2B", "corporate", "professional"],
    platform: "linkedin"
  },
  {
    id: "linkedin-data-1",
    name: "Data Visualization",
    description: "Compelling data visualization for LinkedIn",
    prompt: "Create a professional data visualization image showing growth, success or improvement related to ${mainText:your industry or service}. Use clean, corporate styling with graphs, charts or visual metrics.",
    category: "professional",
    tags: ["data", "visualization", "metrics"],
    platform: "linkedin"
  }
];

// Function to get templates by platform
export const getTemplatesByPlatform = (platform: string): AdTemplate[] => {
  return adTemplates.filter(template => template.platform === platform);
};

export default adTemplates;
