
export interface TemplateCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export interface AdTemplate {
  id: string;
  name: string;
  category: string;
  prompt: string;
  dimensions: {
    width: number;
    height: number;
  };
  // We're not using thumbnail now, but could add it in the future
}

export const templateCategories: TemplateCategory[] = [
  { id: "urgency", name: "Urgency & Scarcity", emoji: "🔥", color: "bg-red-100 text-red-800" },
  { id: "personal", name: "Personal Branding", emoji: "👤", color: "bg-purple-100 text-purple-800" },
  { id: "ecommerce", name: "E-commerce / Retail", emoji: "🛍️", color: "bg-blue-100 text-blue-800" },
  { id: "education", name: "Education / EdTech", emoji: "📚", color: "bg-green-100 text-green-800" },
  { id: "hiring", name: "Hiring & Employer", emoji: "💼", color: "bg-amber-100 text-amber-800" },
  { id: "fintech", name: "Fintech / Finance", emoji: "💳", color: "bg-emerald-100 text-emerald-800" },
  { id: "social", name: "Social & Engagement", emoji: "💬", color: "bg-pink-100 text-pink-800" }
];

export const adTemplates: AdTemplate[] = [
  // Urgency & Scarcity
  {
    id: "flash-countdown",
    name: "Flash Countdown",
    category: "urgency",
    prompt: "Create an Instagram ad image and caption using a countdown-style urgency. Include bold text like 'Ends in 3h!' and highlight a time-sensitive offer for [INSERT PRODUCT or SERVICE]. Style: modern, clean, bold.",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "low-stock",
    name: "Low Stock",
    category: "urgency",
    prompt: "Generate an Instagram ad showing a popular product with a 'Only 3 Left' urgency message. Include realistic product imagery and a minimalist text overlay to drive FOMO.",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "weekend-sale",
    name: "Weekend Sale",
    category: "urgency",
    prompt: "Create a promo image for a weekend sale. Include text: '20% off until Sunday!' and a clean product display. Style: vibrant but trustworthy.",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "early-bird",
    name: "Early Bird",
    category: "urgency",
    prompt: "Design an ad for early bird registration with a clear message like 'Reserve Now and Save'. Use optimistic tones and limited-time visuals.",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "happy-hour",
    name: "Happy Hour",
    category: "urgency",
    prompt: "Create a happy hour-themed ad showing deals valid from 2–5pm. Use time-based icons and a high-contrast, fast-action design.",
    dimensions: { width: 1080, height: 1080 }
  },

  // Personal Branding
  {
    id: "free-guide",
    name: "Free Guide",
    category: "personal",
    prompt: "Create an ad that promotes a downloadable guide from a creator. Use the phrase 'Download my growth plan' and a clean, personal photo with bold CTA button.",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "webinar-promo",
    name: "Webinar Promo",
    category: "personal",
    prompt: "Generate a webinar promotion ad with a headline 'Live This Thursday'. Include a host image and minimal but powerful overlay text.",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "testimonial",
    name: "Testimonial",
    category: "personal",
    prompt: "Create a testimonial-style ad with a quote: 'This changed how I work.' Use a profile photo and stylized quote graphic.",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "poll",
    name: "Poll",
    category: "personal",
    prompt: "Create an interactive-feel image that visually simulates a poll with two options, e.g., A or B. Style it like a carousel or question card.",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "before-after",
    name: "Before & After",
    category: "personal",
    prompt: "Generate an ad showing a 'before and after' visual transformation. Use split screen design and realistic lifestyle imagery.",
    dimensions: { width: 1080, height: 1080 }
  },

  // E-commerce
  {
    id: "product-carousel",
    name: "Product Carousel",
    category: "ecommerce",
    prompt: "Create a carousel preview image with 3–5 featured products and text 'Swipe to Shop the Collection'. Use real product mockups.",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "price-drop",
    name: "Price Drop",
    category: "ecommerce",
    prompt: "Design an ad showing a product with price drop: 'Now $49 (was $79)'. Use contrast and badge design to emphasize savings.",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "vip-deal",
    name: "VIP Deal",
    category: "ecommerce",
    prompt: "Generate an ad promoting an exclusive deal for members: 'Members Save 30%'. Use dark/light luxury theme.",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "back-in-stock",
    name: "Back in Stock",
    category: "ecommerce",
    prompt: "Create a 'Back by Popular Demand' announcement image. Highlight the product and add a minimal background.",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "best-sellers",
    name: "Best Sellers",
    category: "ecommerce",
    prompt: "Showcase a top-selling product with badge or text overlay: '#1 Choice by 5,000+ Customers'.",
    dimensions: { width: 1080, height: 1080 }
  },

  // Education
  {
    id: "course-launch",
    name: "Course Launch",
    category: "education",
    prompt: "Create an education ad announcing a new course with the headline 'Learn AI in 30 Days'. Show a classroom or tech-learning setting.",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "free-trial",
    name: "Free Trial",
    category: "education",
    prompt: "Generate a signup ad promoting a free trial with 'Try Free. No Credit Card.' in bold, centered text.",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "certification",
    name: "Certification",
    category: "education",
    prompt: "Design an ad promoting certification: 'Get Certified Fast'. Use certificate mockups or graduate-style visuals.",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "tutor-match",
    name: "Tutor Match",
    category: "education",
    prompt: "Create a tutor-matching service ad with 'Top Tutors in 24 Hours'. Use mentor-student imagery.",
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: "student-story",
    name: "Student Story",
    category: "education",
    prompt: "Make a student success story ad. Use text like 'How I landed my dream job' and a natural, trustworthy image.",
    dimensions: { width: 1080, height: 1080 }
  }

  // Note: I'm adding a representative subset of the templates for brevity
  // More templates can be added following the same pattern
];

// Helper function to get templates by category
export const getTemplatesByCategory = (categoryId: string): AdTemplate[] => {
  return adTemplates.filter(template => template.category === categoryId);
};

// Helper function to get all categories
export const getAllCategories = (): TemplateCategory[] => {
  return templateCategories;
};
