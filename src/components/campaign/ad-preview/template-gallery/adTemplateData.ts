
export interface AdTemplateCategory {
  id: string;
  name: string;
  description: string;
}

export interface AdTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: string;
  platform: string;
}

export const adTemplateCategories: AdTemplateCategory[] = [
  { id: "urgency", name: "Urgency & Scarcity", description: "Create time pressure and limited availability" },
  { id: "branding", name: "Personal Branding", description: "Establish authority and personality" },
  { id: "ecommerce", name: "E-commerce", description: "Drive product sales and conversions" },
  { id: "education", name: "Education", description: "Promote learning and development" },
  { id: "hiring", name: "Hiring", description: "Recruit top talent" },
  { id: "finance", name: "Finance", description: "Promote financial products and services" },
  { id: "engagement", name: "Social Engagement", description: "Drive likes, comments, and shares" },
];

const instagramTemplates: AdTemplate[] = [
  {
    id: "flash_countdown",
    name: "Flash Countdown",
    description: "Create urgency with a time-limited offer",
    prompt: "Create an Instagram ad image and caption using a countdown-style urgency. Include bold text like 'Ends in 3h!' and highlight a time-sensitive offer for [INSERT PRODUCT or SERVICE]. Style: modern, clean, bold.",
    category: "urgency",
    platform: "instagram"
  },
  {
    id: "low_stock",
    name: "Low Stock Alert",
    description: "Drive purchases with limited availability",
    prompt: "Generate an Instagram ad showing a popular product with a 'Only 3 Left' urgency message. Include realistic product imagery and a minimalist text overlay to drive FOMO.",
    category: "urgency",
    platform: "instagram"
  },
  {
    id: "weekend_sale",
    name: "Weekend Sale",
    description: "Promote a weekend-only special offer",
    prompt: "Create a promo image for a weekend sale. Include text: '20% off until Sunday!' and a clean product display. Style: vibrant but trustworthy.",
    category: "urgency",
    platform: "instagram"
  },
  {
    id: "early_bird",
    name: "Early Bird Registration",
    description: "Promote early registration with special pricing",
    prompt: "Design an ad for early bird registration with a clear message like 'Reserve Now and Save'. Use optimistic tones and limited-time visuals.",
    category: "urgency",
    platform: "instagram"
  },
  {
    id: "free_guide",
    name: "Free Guide",
    description: "Offer valuable content to build your email list",
    prompt: "Create an ad that promotes a downloadable guide from a creator. Use the phrase 'Download my growth plan' and a clean, personal photo with bold CTA button.",
    category: "branding",
    platform: "instagram"
  },
  {
    id: "webinar_promo",
    name: "Webinar Promotion",
    description: "Drive registrations for your upcoming webinar",
    prompt: "Generate a webinar promotion ad with a headline 'Live This Thursday'. Include a host image and minimal but powerful overlay text.",
    category: "branding",
    platform: "instagram"
  },
  {
    id: "testimonial",
    name: "Customer Testimonial",
    description: "Showcase real customer feedback",
    prompt: "Create a testimonial-style ad with a quote: 'This changed how I work.' Use a profile photo and stylized quote graphic.",
    category: "branding",
    platform: "instagram"
  },
  {
    id: "before_after",
    name: "Before & After",
    description: "Show transformation with your product or service",
    prompt: "Generate an ad showing a 'before and after' visual transformation. Use split screen design and realistic lifestyle imagery.",
    category: "branding",
    platform: "instagram"
  },
  {
    id: "product_carousel",
    name: "Product Carousel",
    description: "Showcase multiple products in a swipeable format",
    prompt: "Create a carousel preview image with 3–5 featured products and text 'Swipe to Shop the Collection'. Use real product mockups.",
    category: "ecommerce",
    platform: "instagram"
  },
  {
    id: "price_drop",
    name: "Price Drop",
    description: "Highlight a reduced price or special offer",
    prompt: "Design an ad showing a product with price drop: 'Now $49 (was $79)'. Use contrast and badge design to emphasize savings.",
    category: "ecommerce",
    platform: "instagram"
  },
  {
    id: "vip_deal",
    name: "VIP Deal",
    description: "Offer exclusive access or membership benefits",
    prompt: "Generate an ad promoting an exclusive deal for members: 'Members Save 30%'. Use dark/light luxury theme.",
    category: "ecommerce",
    platform: "instagram"
  },
  {
    id: "back_in_stock",
    name: "Back in Stock",
    description: "Announce product availability after being sold out",
    prompt: "Create a 'Back by Popular Demand' announcement image. Highlight the product and add a minimal background.",
    category: "ecommerce",
    platform: "instagram"
  },
  {
    id: "best_sellers",
    name: "Best Sellers",
    description: "Showcase your top-selling products",
    prompt: "Showcase a top-selling product with badge or text overlay: '#1 Choice by 5,000+ Customers'.",
    category: "ecommerce",
    platform: "instagram"
  },
  {
    id: "course_launch",
    name: "Course Launch",
    description: "Promote a new course or learning opportunity",
    prompt: "Create an education ad announcing a new course with the headline 'Learn AI in 30 Days'. Show a classroom or tech-learning setting.",
    category: "education",
    platform: "instagram"
  },
  {
    id: "free_trial",
    name: "Free Trial",
    description: "Promote a free trial offer",
    prompt: "Generate a signup ad promoting a free trial with 'Try Free. No Credit Card.' in bold, centered text.",
    category: "education",
    platform: "instagram"
  },
  {
    id: "tag_a_friend",
    name: "Tag a Friend",
    description: "Encourage tagging to increase engagement",
    prompt: "Design a social engagement post that invites users to tag friends. Use playful layout and large emoji.",
    category: "engagement",
    platform: "instagram"
  },
  {
    id: "quote_inspiration",
    name: "Quote Inspiration",
    description: "Share an inspirational quote to drive engagement",
    prompt: "Create a clean inspiration quote card with 'Success = Consistency'. Use bold text on soft gradient background.",
    category: "engagement",
    platform: "instagram"
  }
];

// Add LinkedIn templates
const linkedInTemplates: AdTemplate[] = [
  {
    id: "thought_leadership",
    name: "Thought Leadership Article",
    description: "Position yourself as an industry expert",
    prompt: "Create a LinkedIn ad promoting a thought leadership article titled '[ARTICLE TITLE]'. Show a professional headshot of the author with subtle branding. Include text like 'New Industry Insights' and focus on the value readers will gain.",
    category: "branding",
    platform: "linkedin"
  },
  {
    id: "data_insights",
    name: "Data & Research",
    description: "Share compelling data or research findings",
    prompt: "Design a LinkedIn ad featuring key statistics and research findings. Include a simple data visualization (chart or graph) and use text like 'New Research Reveals: [KEY FINDING]'. Style: professional, data-focused, authoritative.",
    category: "education",
    platform: "linkedin"
  },
  {
    id: "hiring_spotlight",
    name: "We're Hiring",
    description: "Attract talent for open positions",
    prompt: "Generate a LinkedIn recruitment ad with text 'Join Our Remote Team'. Include visuals of people working in a modern, collaborative environment with subtle company branding.",
    category: "hiring",
    platform: "linkedin"
  },
  {
    id: "webinar_business",
    name: "Business Webinar",
    description: "Promote a professional webinar or event",
    prompt: "Create a LinkedIn webinar promotion with 'Join Industry Leaders' headline and date/time details. Show professional speakers and use a clean, corporate aesthetic.",
    category: "education",
    platform: "linkedin"
  }
];

// Merge all templates
const allTemplates: AdTemplate[] = [
  ...instagramTemplates,
  ...linkedInTemplates
];

export const getTemplatesByPlatform = (platform: string): AdTemplate[] => {
  return allTemplates.filter(template => template.platform === platform.toLowerCase());
};

export const getTemplateById = (id: string): AdTemplate | undefined => {
  return allTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): AdTemplate[] => {
  return allTemplates.filter(template => template.category === category);
};
