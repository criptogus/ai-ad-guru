
import { AdTemplate } from "./TemplateGallery";

// Categories for ad templates
export const adTemplateCategories = [
  { id: "all", name: "All Templates" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "product", name: "Product" },
  { id: "promotional", name: "Promotional" },
  { id: "storytelling", name: "Storytelling" },
  { id: "ugc", name: "User Generated" },
  { id: "before_after", name: "Before & After" },
  { id: "tutorial", name: "Tutorial" }
];

// Get templates by platform
export const getTemplatesByPlatform = (platform: string): AdTemplate[] => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return instagramTemplates;
    case 'linkedin':
      return linkedInTemplates;
    case 'google':
      return googleTemplates;
    case 'microsoft':
      return microsoftTemplates;
    default:
      return instagramTemplates; // Default to Instagram
  }
};

// Instagram ad templates
const instagramTemplates: AdTemplate[] = [
  {
    id: "instagram-lifestyle-1",
    name: "Lifestyle Aspirational",
    description: "Show your product in an aspirational lifestyle setting",
    prompt: "Create a lifestyle Instagram ad showing people enjoying your product in a natural, aspirational setting. Use soft lighting and authentic emotions.",
    category: "lifestyle",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "instagram-product-1",
    name: "Product Showcase",
    description: "Highlight your product features in a clean, minimal setting",
    prompt: "Create a clean, minimal product showcase with your product as the hero against a simple background. Use subtle shadows and highlight key features.",
    category: "product",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "instagram-promo-1",
    name: "Limited Time Offer",
    description: "Create urgency with a time-limited promotion",
    prompt: "Design a promotional Instagram ad with bold text announcing a limited-time offer. Use high contrast colors and include a countdown or deadline element.",
    category: "promotional",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "instagram-story-1",
    name: "Story Carousel",
    description: "Tell a compelling story across multiple frames",
    prompt: "Create a story-driven Instagram carousel ad that progresses through a narrative. Start with a problem and end with your product as the solution.",
    category: "storytelling",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "instagram-ugc-1",
    name: "User Generated Content",
    description: "Create an authentic, user-generated content style ad",
    prompt: "Design an Instagram ad that looks like authentic user-generated content. Use realistic lighting, slightly imperfect composition, and genuine human expressions.",
    category: "ugc",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "instagram-before-after",
    name: "Before & After",
    description: "Show transformation with a before and after comparison",
    prompt: "Create a before-and-after comparison Instagram ad that demonstrates your product's transformative effect. Use a clear split-screen layout with consistent lighting.",
    category: "before_after",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "instagram-tutorial",
    name: "How-To Tutorial",
    description: "Teach viewers how to use your product or service",
    prompt: "Design an Instagram ad showing a simple step-by-step tutorial for using your product. Include numbered steps and focus on the ease of use and benefits.",
    category: "tutorial",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 }
  }
];

// LinkedIn ad templates
const linkedInTemplates: AdTemplate[] = [
  {
    id: "linkedin-professional-1",
    name: "Professional Insight",
    description: "Share valuable industry insights and position as thought leader",
    prompt: "Create a professional LinkedIn ad with a clean, corporate aesthetic. Include a data point or insight that demonstrates thought leadership in your industry.",
    category: "storytelling",
    platform: "linkedin",
    dimensions: { width: 1200, height: 627 }
  },
  {
    id: "linkedin-testimonial-1",
    name: "Client Testimonial",
    description: "Showcase a client success story with real results",
    prompt: "Design a LinkedIn ad featuring a client testimonial with a professional headshot, quote, and measurable results achieved with your product or service.",
    category: "ugc",
    platform: "linkedin",
    dimensions: { width: 1200, height: 627 }
  },
  {
    id: "linkedin-event-1",
    name: "Event Promotion",
    description: "Promote a webinar, conference or professional event",
    prompt: "Create a LinkedIn event promotion ad with clear date, time, and value proposition. Use a professional color scheme and include speaker information if applicable.",
    category: "promotional",
    platform: "linkedin",
    dimensions: { width: 1200, height: 627 }
  },
  {
    id: "linkedin-product-1",
    name: "B2B Product Feature",
    description: "Highlight a key feature of your B2B product or service",
    prompt: "Design a LinkedIn ad that spotlights a specific feature of your B2B product. Use a clean, professional layout with minimal text and a clear business benefit.",
    category: "product",
    platform: "linkedin",
    dimensions: { width: 1200, height: 627 }
  },
  {
    id: "linkedin-statistic-1",
    name: "Data-Driven Insight",
    description: "Share compelling statistics related to your industry",
    prompt: "Create a LinkedIn ad centered around a striking statistic or data point. Use a bold, clear presentation of the number with supporting text explaining its relevance.",
    category: "storytelling",
    platform: "linkedin",
    dimensions: { width: 1200, height: 627 }
  }
];

// Placeholder for Google ad templates
const googleTemplates: AdTemplate[] = [
  {
    id: "google-search-1",
    name: "Search Ad Template",
    description: "Basic Google search ad template",
    prompt: "Design a compelling Google search ad with clear headline and description focused on your main keywords and value proposition.",
    category: "promotional",
    platform: "google",
    dimensions: { width: 300, height: 250 }
  }
];

// Placeholder for Microsoft ad templates
const microsoftTemplates: AdTemplate[] = [
  {
    id: "microsoft-search-1",
    name: "Bing Search Ad Template",
    description: "Basic Microsoft/Bing search ad template",
    prompt: "Create a Microsoft Ads campaign with clear headlines and descriptions targeting your core audience and highlighting your unique selling points.",
    category: "promotional",
    platform: "microsoft",
    dimensions: { width: 300, height: 250 }
  }
];
