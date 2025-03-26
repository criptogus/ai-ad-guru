
import { useState } from 'react';

interface TriggerData {
  id: string;
  name: string;
  description: string;
}

// Enhanced template structure for ad text generation
const enhancedTextPrompt = `# 🎯 Enhanced Prompt for Generating High-Quality Ad Texts

Use this prompt with OpenAI's ChatGPT-4o to generate highly relevant and compelling ad text variations across different platforms (Google, Instagram, LinkedIn, Bing). This prompt ensures alignment with brand language, target audience, and the chosen mental trigger.

---

## 🧠 Prompt Template

"You are an elite marketing copywriter specialized in high-converting digital ads for Google Search, Instagram, LinkedIn, and Bing. Based on the company's tone of voice, business context, and target audience, generate **[NUMBER] variations** of ads using the best practices for the selected platform.

### Context to use:
- **Company Description:** [INSERT COMPANY INFO]
- **Target Audience:** [INSERT TARGET]
- **Competitors:** [INSERT COMPETITORS]
- **Platform:** [GOOGLE / INSTAGRAM / LINKEDIN / BING]
- **Language:** [INSERT LANGUAGE]
- **Copywriting Style:** [E.g., Conversational, Authoritative, Persuasive]
- **Mental Trigger Style:** [E.g., Urgency, Authority, Social Proof, Curiosity, Emotional Appeal]

### Guidelines:
- Use natural, compelling and brand-aligned language.
- Match the platform tone (e.g., concise + benefit-oriented for Google, emotional + story-driven for Instagram).
- Embed the mental trigger requested.
- Ensure all content is written in the selected **language** and is natively localized.
- Avoid generic phrases or filler content like "Designed with you in mind".

Return a JSON object for each ad variation with:
- \`headline\`
- \`description\`
- \`cta\`
- \`trigger_used\`
- \`style_used\`

Each ad must sound like it was written by a top ad agency using best-in-class performance strategies."

---`;

const imageTemplateGallery = `# 🎯 Ad Template Prompt Gallery (Generic for OpenAI API)

Use the following prompts with ChatGPT-4o to generate Instagram or LinkedIn ad images and copy using state-of-the-art advertising practices. Each prompt is aligned with a specific mental trigger and campaign goal.

---

## 🔥 Urgency & Scarcity

### Flash Countdown
"Create an Instagram ad image and caption using a countdown-style urgency. Include bold text like 'Ends in 3h!' and highlight a time-sensitive offer for [INSERT PRODUCT or SERVICE]. Style: modern, clean, bold."

### Low Stock
"Generate an Instagram ad showing a popular product with a 'Only 3 Left' urgency message. Include realistic product imagery and a minimalist text overlay to drive FOMO."

### Weekend Sale
"Create a promo image for a weekend sale. Include text: '20% off until Sunday!' and a clean product display. Style: vibrant but trustworthy."

### Early Bird
"Design an ad for early bird registration with a clear message like 'Reserve Now and Save'. Use optimistic tones and limited-time visuals."

### Happy Hour
"Create a happy hour-themed ad showing deals valid from 2–5pm. Use time-based icons and a high-contrast, fast-action design."

---

## 👤 Personal Branding

### Free Guide
"Create an ad that promotes a downloadable guide from a creator. Use the phrase 'Download my growth plan' and a clean, personal photo with bold CTA button."

### Webinar Promo
"Generate a webinar promotion ad with a headline 'Live This Thursday'. Include a host image and minimal but powerful overlay text."

### Testimonial
"Create a testimonial-style ad with a quote: 'This changed how I work.' Use a profile photo and stylized quote graphic."

### Poll
"Create an interactive-feel image that visually simulates a poll with two options, e.g., A or B. Style it like a carousel or question card."

### Before & After
"Generate an ad showing a 'before and after' visual transformation. Use split screen design and realistic lifestyle imagery."

---

## 🛍️ E-commerce / Retail

### Product Carousel
"Create a carousel preview image with 3–5 featured products and text 'Swipe to Shop the Collection'. Use real product mockups."

### Price Drop
"Design an ad showing a product with price drop: 'Now $49 (was $79)'. Use contrast and badge design to emphasize savings."

### VIP Deal
"Generate an ad promoting an exclusive deal for members: 'Members Save 30%'. Use dark/light luxury theme."

### Back in Stock
"Create a 'Back by Popular Demand' announcement image. Highlight the product and add a minimal background."

### Best Sellers
"Showcase a top-selling product with badge or text overlay: '#1 Choice by 5,000+ Customers'."

---

## 📚 Education / EdTech

### Course Launch
"Create an education ad announcing a new course with the headline 'Learn AI in 30 Days'. Show a classroom or tech-learning setting."

### Free Trial
"Generate a signup ad promoting a free trial with 'Try Free. No Credit Card.' in bold, centered text."

### Certification
"Design an ad promoting certification: 'Get Certified Fast'. Use certificate mockups or graduate-style visuals."

### Tutor Match
"Create a tutor-matching service ad with 'Top Tutors in 24 Hours'. Use mentor-student imagery."

### Student Story
"Make a student success story ad. Use text like 'How I landed my dream job' and a natural, trustworthy image."

---

## 💼 Hiring & Employer Branding

### We're Hiring
"Generate a hiring ad with text 'Join Our Remote Team'. Include visuals of people working from home."

### Meet the Team
"Create a collage or profile card-style ad that introduces the team with quote overlays."

### Referral Bonus
"Ad promoting a referral program: 'Refer a Friend and Earn $100'. Use clear CTA and positive reward symbols."

### Company Perks
"Design a modern job ad with perks like 'Remote. Flexible. Balanced.' Include lifestyle imagery."

### Life at Work
"Show real office moments or team culture with caption 'We build cool things, together.'"

---

## 💳 Fintech / Finance

### Cashback Offer
"Ad promoting a financial product: 'Get 10% Cashback This Month'. Use a card design and benefit overlay."

### Savings Goal
"Create a visual that tracks a savings goal with 'You're 85% There!'. Use progress bar design."

### Credit Score
"Generate an ad showing score boost: 'Boost Your Score Fast'. Use clean credit dashboard mockups."

### Smart Tip
"Create a tip/advice post with caption 'Pay Yourself First'. Design as a quote card or infographic."

### Fintech Launch
"Design a product launch visual: 'Now Available in 🇧🇷 Brazil'. Use branded tech UI imagery."

---

## 💬 Social & Engagement

### Tag a Friend
"Design a social engagement post that invites users to tag friends. Use playful layout and large emoji."

### Quote Inspiration
"Create a clean inspiration quote card with 'Success = Consistency'. Use bold text on soft gradient background."

### Challenge
"Design a '7-Day Reset Challenge' ad. Use checklist or day-by-day layout."

### This or That
"Create a comparison card: 'Dark Mode ☑️ Light Mode ⬜️'. Use visual toggles."

### Viral Hook
"Generate a mysterious teaser ad with the caption 'You won't believe this AI ad…'. Use visual intrigue."`;

// Mental trigger data for each platform
const googleTriggers: TriggerData[] = [
  { id: 'urgency', name: 'Urgency', description: 'Create a sense of time-limited opportunity' },
  { id: 'social_proof', name: 'Social Proof', description: 'Show how many others are using and trusting the product' },
  { id: 'problem_solution', name: 'Problem-Solution', description: 'Present a problem and position your product as the solution' },
  { id: 'curiosity', name: 'Curiosity', description: 'Spark interest with intriguing or unusual information' },
  { id: 'comparison', name: 'Comparison', description: 'Directly compare your offering with alternatives' },
];

const instagramTriggers: TriggerData[] = [
  { id: 'lifestyle', name: 'Lifestyle Aspiration', description: 'Show the aspirational lifestyle that comes with your product' },
  { id: 'before_after', name: 'Before & After', description: 'Demonstrate visible transformation using your product' },
  { id: 'user_generated', name: 'User Generated Content', description: 'Feature authentic customer content and testimonials' },
  { id: 'storytelling', name: 'Storytelling', description: 'Create an emotional narrative around your brand' },
  { id: 'tutorial', name: 'Tutorial/How-to', description: 'Provide educational content showing product value' },
];

const linkedInTriggers: TriggerData[] = [
  { id: 'thought_leadership', name: 'Thought Leadership', description: 'Establish authority through valuable industry insights' },
  { id: 'data_insights', name: 'Data & Insights', description: 'Share research and data-backed information' },
  { id: 'professional_growth', name: 'Professional Growth', description: 'Focus on career advancement and skill development' },
  { id: 'industry_trends', name: 'Industry Trends', description: 'Highlight emerging trends relevant to your audience' },
  { id: 'case_study', name: 'Case Study', description: 'Share detailed success stories with measurable results' },
];

const microsoftTriggers: TriggerData[] = [
  { id: 'problem_solution', name: 'Problem-Solution', description: 'Present a problem and position your product as the solution' },
  { id: 'competitive_advantage', name: 'Competitive Advantage', description: 'Highlight what makes your offering better than alternatives' },
  { id: 'value_proposition', name: 'Value Proposition', description: 'Clearly communicate the primary benefits of your product' },
  { id: 'specificity', name: 'Specificity', description: 'Be precise about features, benefits, and offers' },
  { id: 'call_to_action', name: 'Call to Action', description: 'Use strong, clear direction for what to do next' },
];

// Platform-specific templates
const googleTemplates = [
  "Write 3 Google search ads for [COMPANY] that highlight our competitive advantage in [INDUSTRY]. Use the urgency trigger by mentioning our limited-time promotion.",
  "Create 5 Google ad variations focused on solving [PROBLEM] for [TARGET AUDIENCE]. Emphasize how our solution is better than competitors.",
  "Generate 3 Google search ads that use social proof by mentioning our 1000+ satisfied customers and 4.8-star rating.",
  enhancedTextPrompt
];

const instagramTemplates = [
  "Create 3 Instagram ad captions featuring lifestyle benefits of [PRODUCT/SERVICE] for [TARGET AUDIENCE]. Include 3 relevant hashtags and a strong CTA.",
  "Write 3 storytelling Instagram captions that create an emotional connection with [TARGET AUDIENCE] and subtly introduce our [PRODUCT/SERVICE] as part of the narrative.",
  "Generate 3 Instagram captions featuring before/after transformations with our [PRODUCT]. Include powerful testimonial elements and action-driving conclusion.",
  imageTemplateGallery
];

const linkedInTemplates = [
  "Write 3 LinkedIn ad variations for [COMPANY] positioning us as thought leaders in [INDUSTRY]. Focus on providing value and insights rather than direct selling.",
  "Create 3 data-driven LinkedIn ads showcasing how [PRODUCT/SERVICE] improved results for clients, with specific metrics and outcomes.",
  "Generate 3 LinkedIn ad variations targeting [PROFESSIONAL ROLE] who want to advance their career using our [PRODUCT/SERVICE]. Include industry-specific pain points.",
  enhancedTextPrompt
];

const microsoftTemplates = [
  "Write 3 Microsoft search ads that clearly communicate our value proposition to [TARGET AUDIENCE] who are searching for [KEYWORDS].",
  "Create 3 Microsoft ad variations that specifically address the pain points of [TARGET AUDIENCE] and position our [PRODUCT/SERVICE] as the ideal solution.",
  "Generate 3 Microsoft search ads with strong, specific CTAs directing users to [LANDING PAGE] to take immediate action.",
  enhancedTextPrompt
];

export const useTriggerData = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('google');

  // Get triggers for the selected platform
  const getPlatformTriggers = (platform: string): TriggerData[] => {
    switch (platform.toLowerCase()) {
      case 'google': return googleTriggers;
      case 'instagram': return instagramTriggers;
      case 'linkedin': return linkedInTriggers;
      case 'microsoft': return microsoftTriggers;
      default: return [];
    }
  };

  // Get templates for the selected platform
  const getPlatformTemplates = (platform: string): string[] => {
    switch (platform.toLowerCase()) {
      case 'google': return googleTemplates;
      case 'instagram': return instagramTemplates;
      case 'linkedin': return linkedInTemplates;
      case 'microsoft': return microsoftTemplates;
      default: return [];
    }
  };

  return {
    selectedPlatform,
    setSelectedPlatform,
    getPlatformTriggers,
    getPlatformTemplates
  };
};
