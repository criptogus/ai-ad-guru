
import { AdTemplate } from "./TemplateGallery";

// Categories for ad templates
export const adTemplateCategories = [
  { id: "lifestyle", name: "Lifestyle" },
  { id: "product", name: "Product Showcase" },
  { id: "testimonial", name: "Testimonials" },
  { id: "promotional", name: "Promotional" },
  { id: "storytelling", name: "Storytelling" },
  { id: "tutorial", name: "Tutorial/How-to" },
  { id: "creative", name: "Creative" }
];

// Sample ad templates for different platforms
const adTemplates: AdTemplate[] = [
  // Instagram Ad Templates - Lifestyle
  {
    id: "instagram-lifestyle-1",
    name: "Modern Lifestyle Scene",
    description: "Clean, aspirational lifestyle image showing product in everyday use",
    prompt: "Create a modern, aspirational Instagram lifestyle photo showing a person using a product naturally in a well-lit, minimalist home environment. Use soft natural lighting, neutral tones, and a shallow depth of field for a professional look.",
    category: "lifestyle",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "instagram-lifestyle-2",
    name: "Urban Fashion Moment",
    description: "Street style fashion photography with urban background",
    prompt: "Generate a trendy urban street style image for Instagram showing a fashionable person in an urban setting. Include architectural elements, natural golden-hour lighting, and subtle bokeh effects. Style should be candid yet polished.",
    category: "lifestyle",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 }
  },
  
  // Instagram Ad Templates - Product
  {
    id: "instagram-product-1",
    name: "Minimalist Product Feature",
    description: "Clean product photography on simple background",
    prompt: "Create a minimalist product photo for Instagram with a single product as the hero against a simple, clean background. Use soft shadows, crisp details, and perfect lighting to highlight product features. Style: professional, modern e-commerce.",
    category: "product",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "instagram-product-2",
    name: "Flat Lay Arrangement",
    description: "Overhead arrangement of products and complementary items",
    prompt: "Generate an Instagram-worthy flat lay product arrangement viewed from above. Include the main product surrounded by complementary items and props that tell a story. Use natural lighting and a neutral surface as the background.",
    category: "product",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 }
  },
  
  // Instagram Ad Templates - Testimonial
  {
    id: "instagram-testimonial-1",
    name: "Customer Quote Card",
    description: "Elegant quote card with customer testimonial",
    prompt: "Create an elegant Instagram testimonial image with a short customer quote overlay on a lifestyle background. Use semi-transparent overlay for text readability, high-quality photography, and clean typography. Style: trustworthy and professional.",
    category: "testimonial",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 }
  },
  
  // Instagram Ad Templates - Promotional
  {
    id: "instagram-promo-1",
    name: "Limited Time Offer",
    description: "Bold promotional graphic with offer details",
    prompt: "Design an eye-catching Instagram promotional image that announces a limited-time offer. Include bold typography with the discount/offer prominently displayed, use brand colors, and add subtle animated elements that create urgency. Style: bold, attention-grabbing.",
    category: "promotional",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "instagram-promo-2",
    name: "New Product Launch",
    description: "Exciting product launch announcement",
    prompt: "Create an Instagram announcement image for a new product launch. Show the product with 'NEW' or 'JUST LAUNCHED' text overlay, use exciting visual elements like sparkles or spotlights, and ensure the product is the hero. Style: exciting, premium.",
    category: "promotional",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 }
  },
  
  // Instagram Ad Templates - Storytelling
  {
    id: "instagram-story-1",
    name: "Brand Origin Story",
    description: "Visual storytelling about brand beginnings",
    prompt: "Generate an Instagram image that tells a brand origin story. Show vintage/historical elements mixed with modern outcomes, use a narrative-driven composition, and add subtle text overlays if needed. Style: authentic, emotional, journey-focused.",
    category: "storytelling",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 }
  },
  
  // Instagram Ad Templates - Tutorial
  {
    id: "instagram-tutorial-1",
    name: "Simple Steps Process",
    description: "Clear step-by-step instructions with visuals",
    prompt: "Design an Instagram tutorial image with 3 simple steps showing how to use a product. Use numbers or step indicators, show before/after or progress visuals, and keep text minimal but instructional. Style: clear, helpful, easy to understand.",
    category: "tutorial", 
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 }
  },
  
  // Instagram Ad Templates - Creative
  {
    id: "instagram-creative-1",
    name: "Surreal Product Concept",
    description: "Artistic and surreal product visualization",
    prompt: "Create a surreal, artistic Instagram image featuring a product in an impossible or dreamlike scenario. Use bold colors, unusual scale, and creative composition to make the image stop the scroll. Style: artistic, memorable, conversation-starting.",
    category: "creative",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 }
  },
  
  // LinkedIn Ad Templates
  {
    id: "linkedin-professional-1",
    name: "Professional Headshot",
    description: "Polished professional portrait for thought leadership",
    prompt: "Create a professional LinkedIn headshot of a business person against a neutral office background. Use professional lighting, business-appropriate attire, and a confident but approachable expression. Style: corporate, trustworthy, LinkedIn-native.",
    category: "lifestyle",
    platform: "linkedin",
    dimensions: { width: 1200, height: 627 }
  },
  
  // Google Ad Templates (though these are text-based, we'll add them for completeness)
  {
    id: "google-service-1",
    name: "Service Highlight",
    description: "Text template highlighting key business services",
    prompt: "Write a Google Search Ad that highlights a business service with clear benefits and a strong call to action. Include specific metrics if possible and ensure proper keyword placement.",
    category: "promotional",
    platform: "google",
    dimensions: { width: 300, height: 250 }
  }
];

// Function to get templates by platform
export const getTemplatesByPlatform = (platform: string): AdTemplate[] => {
  return adTemplates.filter(template => template.platform === platform);
};

// Export all templates
export default adTemplates;
