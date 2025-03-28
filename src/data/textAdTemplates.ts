
export interface TextAdTemplate {
  id: string;
  title: string;
  category: string;
  industry?: string;
  headline1: string;
  headline2: string;
  headline3?: string;
  description1: string;
  description2?: string;
  displayPath?: string;
  mindTrigger?: string;
  tone?: string;
  isQuestion?: boolean;
}

// Google and Microsoft Ads templates organized by industry
export const textAdTemplates: TextAdTemplate[] = [
  // Food & Beverage Templates (Inspired by Coca-Cola & Nestlé)
  {
    id: "food_beverage_question",
    title: "Food & Beverage Question",
    category: "food",
    industry: "food",
    headline1: "Thirsty for More?",
    headline2: "Refresh with Us",
    headline3: "Order Online Today",
    description1: "Sparkling drinks that bring joy to every sip. Taste now!",
    description2: "Limited flavors await—grab yours before they're gone.",
    mindTrigger: "joy",
    tone: "friendly",
    isQuestion: true
  },
  {
    id: "food_beverage_bliss",
    title: "Pure Bliss",
    category: "food",
    industry: "food",
    headline1: "Pure Bliss in a Sip",
    headline2: "Taste the Moment",
    headline3: "Order Now",
    description1: "Indulge in refreshing flavors made just for you. Sip now!",
    description2: "Premium quality, extraordinary taste. Experience the difference.",
    mindTrigger: "joy",
    tone: "friendly"
  },
  {
    id: "food_beverage_refresh",
    title: "Refresh Your Day",
    category: "food",
    industry: "food",
    headline1: "Refresh Your Day",
    headline2: "Bold New Flavors",
    headline3: "Try Them Today",
    description1: "Discover drinks that spark happiness. Try one today!",
    description2: "Crafted with care, delivered to your door. Order now.",
    mindTrigger: "joy",
    tone: "friendly"
  },
  
  // Sports & Fitness Templates (Inspired by Nike)
  {
    id: "fitness_question",
    title: "Fitness Challenge",
    category: "fitness",
    industry: "fitness",
    headline1: "Ready to Crush It?",
    headline2: "Power Up Now",
    headline3: "Shop Top Gear",
    description1: "Gear that fuels your best performance. Shop now and win!",
    description2: "Designed for champions, built to last. Level up today.",
    mindTrigger: "empowerment",
    tone: "bold",
    isQuestion: true
  },
  {
    id: "fitness_unleashed",
    title: "Unleash Your Best",
    category: "fitness",
    industry: "fitness",
    headline1: "Unleash Your Best",
    headline2: "Train Like a Pro",
    headline3: "Shop Now",
    description1: "Top-tier fitness gear built for champions. Get yours!",
    description2: "Push beyond your limits with premium equipment. Act now!",
    mindTrigger: "empowerment",
    tone: "bold"
  },
  {
    id: "fitness_limit",
    title: "Push the Limit",
    category: "fitness",
    industry: "fitness",
    headline1: "Push the Limit",
    headline2: "Gear Up Today",
    headline3: "Free Shipping",
    description1: "Outfit your grind with bold, durable designs. Act now!",
    description2: "Performance wear that moves with you. Shop and save today!",
    mindTrigger: "empowerment",
    tone: "bold"
  },
  
  // Education Templates (Inspired by Apple & Google)
  {
    id: "education_question",
    title: "Skills Fast",
    category: "education",
    industry: "education",
    headline1: "Need Skills Fast?",
    headline2: "Learn Smarter",
    headline3: "Start Today",
    description1: "Master new skills with sleek, simple courses. Start now!",
    description2: "Learn at your own pace. Join thousands of successful students.",
    mindTrigger: "inspiration",
    tone: "modern",
    isQuestion: true
  },
  {
    id: "education_future",
    title: "Unlock Your Future",
    category: "education",
    industry: "education",
    headline1: "Unlock Your Future",
    headline2: "Study Anytime",
    headline3: "Enroll Now",
    description1: "Cutting-edge learning designed for you. Enroll today!",
    description2: "Expert instructors, flexible schedules. Transform your career.",
    mindTrigger: "inspiration",
    tone: "modern"
  },
  {
    id: "education_growth",
    title: "Growth & Learning",
    category: "education",
    industry: "education",
    headline1: "Grow with Ease",
    headline2: "Smart Courses",
    headline3: "Special Offer",
    description1: "Simplify your education with top tools. Tap to begin!",
    description2: "Accessible learning for busy professionals. Start your journey.",
    mindTrigger: "inspiration",
    tone: "modern"
  },
  
  // Fintech Templates (Inspired by Tesla & Microsoft)
  {
    id: "fintech_question",
    title: "Investing Guide",
    category: "finance",
    industry: "fintech",
    headline1: "Lost in Investing?",
    headline2: "Grow with Us",
    headline3: "Start Free",
    description1: "Smart tools for secure wealth growth. Start now and win!",
    description2: "Expert insights, powerful algorithms. Take control of your finances.",
    mindTrigger: "trust",
    tone: "authoritative",
    isQuestion: true
  },
  {
    id: "fintech_future",
    title: "Future Proof Money",
    category: "finance",
    industry: "fintech",
    headline1: "Future-Proof Money",
    headline2: "Act Now",
    headline3: "Free Analysis",
    description1: "Precision fintech trusted by pros. Tap to secure yours!",
    description2: "Innovative solutions for modern investors. Join today.",
    mindTrigger: "trust",
    tone: "authoritative"
  },
  {
    id: "fintech_simple",
    title: "Simple Wealth",
    category: "finance",
    industry: "fintech",
    headline1: "Wealth Made Simple",
    headline2: "Join Today",
    headline3: "Free Trial",
    description1: "Innovative finance tools that work. Grow your savings!",
    description2: "Secure, transparent, and effective. Start in minutes.",
    mindTrigger: "trust",
    tone: "authoritative"
  },
  
  // Law Templates (Inspired by HBO & Apple)
  {
    id: "law_question",
    title: "Justice Now",
    category: "law",
    industry: "law",
    headline1: "Need Justice Now?",
    headline2: "We Fight for You",
    headline3: "Free Consult",
    description1: "Expert legal help with proven wins. Call now for peace!",
    description2: "Dedicated attorneys standing by. Your rights matter to us.",
    mindTrigger: "authority",
    tone: "professional",
    isQuestion: true
  },
  {
    id: "law_edge",
    title: "Legal Edge",
    category: "law",
    industry: "law",
    headline1: "Your Legal Edge",
    headline2: "Act Today",
    headline3: "Win With Us",
    description1: "Top attorneys, simple solutions. Secure your rights now!",
    description2: "Experienced team, exceptional results. Schedule your consultation.",
    mindTrigger: "authority",
    tone: "professional"
  },
  {
    id: "law_simple",
    title: "Simple Justice",
    category: "law",
    industry: "law",
    headline1: "Justice Simplified",
    headline2: "Trust Us Now",
    headline3: "Call Today",
    description1: "Legal pros who deliver results. Tap to start today!",
    description2: "Straightforward advice, powerful representation. We're here for you.",
    mindTrigger: "authority",
    tone: "professional"
  },
  
  // Pet Templates (Inspired by Nestlé & Coca-Cola)
  {
    id: "pet_question",
    title: "Spoil Your Pet",
    category: "pet",
    industry: "pet",
    headline1: "Spoil Your Pet?",
    headline2: "Shop Fun Now",
    headline3: "Free Delivery",
    description1: "Treats and toys that bring tail-wagging joy. Order now!",
    description2: "Premium quality products for your furry friends. Save today!",
    mindTrigger: "joy",
    tone: "warm",
    isQuestion: true
  },
  {
    id: "pet_happy",
    title: "Happy Pets",
    category: "pet",
    industry: "pet",
    headline1: "Happy Pets Here",
    headline2: "Grab the Joy",
    headline3: "Shop Online",
    description1: "Premium pet gear for every moment. Shop now and save!",
    description2: "Trusted by pet parents everywhere. Free shipping on orders $25+.",
    mindTrigger: "joy",
    tone: "warm"
  },
  {
    id: "pet_love",
    title: "Love Your Pet",
    category: "pet",
    industry: "pet",
    headline1: "Love Your Pet",
    headline2: "Best Treats",
    headline3: "Shop & Save",
    description1: "Wholesome goodies pets adore. Tap to spoil them today!",
    description2: "Healthy, natural ingredients they'll love. Order now!",
    mindTrigger: "joy",
    tone: "warm"
  },
  
  // Services Templates (Inspired by Microsoft & Google)
  {
    id: "services_question",
    title: "Business Solutions",
    category: "services",
    industry: "services",
    headline1: "Business Struggling?",
    headline2: "Solutions That Work",
    headline3: "Contact Us",
    description1: "Proven strategies that drive growth. Book your consultation today!",
    description2: "Expert team ready to solve your challenges. Take the first step now.",
    mindTrigger: "trust",
    tone: "professional",
    isQuestion: true
  },
  {
    id: "services_innovation",
    title: "Innovation Partner",
    category: "services",
    industry: "services",
    headline1: "Innovative Solutions",
    headline2: "Partner With Us",
    headline3: "Free Analysis",
    description1: "Cutting-edge services designed for results. Transform your business today!",
    description2: "Trusted by leading companies. Schedule your consultation now.",
    mindTrigger: "trust",
    tone: "professional"
  },
  {
    id: "services_expert",
    title: "Expert Services",
    category: "services",
    industry: "services",
    headline1: "Expert Guidance",
    headline2: "Proven Results",
    headline3: "Start Today",
    description1: "Strategic solutions tailored to your goals. Take action now!",
    description2: "Data-driven approach, measurable outcomes. Book your free assessment.",
    mindTrigger: "trust",
    tone: "professional"
  },
  
  // Health Templates (Inspired by Nestlé & Nike)
  {
    id: "health_question",
    title: "Health Question",
    category: "health",
    industry: "health",
    headline1: "Feel Tired Always?",
    headline2: "Boost Your Energy",
    headline3: "Natural Solution",
    description1: "Discover natural supplements that revitalize your day. Feel the difference!",
    description2: "Scientifically formulated for optimal health. Try risk-free today.",
    mindTrigger: "wellness",
    tone: "empathetic",
    isQuestion: true
  },
  {
    id: "health_vitality",
    title: "Pure Vitality",
    category: "health",
    industry: "health",
    headline1: "Pure Vitality",
    headline2: "Feel Your Best",
    headline3: "Shop Now",
    description1: "Premium health products for your active lifestyle. Order today!",
    description2: "Clean ingredients, powerful results. Join thousands of satisfied customers.",
    mindTrigger: "wellness",
    tone: "empathetic"
  },
  {
    id: "health_wellness",
    title: "Wellness Journey",
    category: "health",
    industry: "health",
    headline1: "Your Wellness Journey",
    headline2: "Starts Today",
    headline3: "Free Shipping",
    description1: "Holistic solutions for mind and body. Take the first step now!",
    description2: "Expert-formulated products for lasting health. Order and save 15%.",
    mindTrigger: "wellness",
    tone: "empathetic"
  }
];

// Helper functions to work with templates
export const getTextAdTemplatesByIndustry = (industry: string): TextAdTemplate[] => {
  return textAdTemplates.filter(template => template.industry === industry);
};

export const getQuestionTemplates = (): TextAdTemplate[] => {
  return textAdTemplates.filter(template => template.isQuestion === true);
};

export const getTemplatesByCategory = (category: string): TextAdTemplate[] => {
  return textAdTemplates.filter(template => template.category === category);
};

export const getTextAdCategories = (): string[] => {
  const categories = new Set(textAdTemplates.map(template => template.category));
  return Array.from(categories);
};

export const getTextAdIndustries = (): string[] => {
  const industries = new Set(textAdTemplates.map(template => template.industry).filter(Boolean) as string[]);
  return Array.from(industries);
};
