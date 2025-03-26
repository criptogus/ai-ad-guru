
import { MentalTrigger, TriggerCategoryInfo } from './types';

export const triggerCategories: TriggerCategoryInfo[] = [
  {
    id: 'urgency',
    name: 'Urgency & Scarcity',
    description: 'Push users to act quickly with time constraints or limited availability',
    emoji: '🧨',
    color: 'bg-red-100 text-red-800'
  },
  {
    id: 'social-proof',
    name: 'Social Proof',
    description: 'Show popularity, reviews, testimonials to build credibility',
    emoji: '💬',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'value-proposition',
    name: 'Value Proposition',
    description: 'Highlight clear benefits, ROI, and why your offer matters',
    emoji: '🚀',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'authority',
    name: 'Authority & Expertise',
    description: 'Establish trust through credentials, experience, or certifications',
    emoji: '🧠',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'curiosity',
    name: 'Curiosity & Intrigue',
    description: 'Create information gaps that spark interest and questions',
    emoji: '🪄',
    color: 'bg-amber-100 text-amber-800'
  },
  {
    id: 'emotional',
    name: 'Emotional Appeal',
    description: 'Connect with feelings, aspirations, or pain points of your audience',
    emoji: '❤️',
    color: 'bg-pink-100 text-pink-800'
  }
];

export const mentalTriggers: MentalTrigger[] = [
  // Urgency & Scarcity Triggers
  {
    id: 'limited-time',
    name: 'Limited Time Offer',
    description: 'Create time pressure to drive immediate action',
    category: 'urgency',
    examples: ['Last chance', 'Ends soon', 'Only today', "Don't miss out"],
    promptTemplate: 'Create 3 variations of high-converting [PLATFORM] Ads using urgency and time limits. Format with appropriate headlines and descriptions. The offer is: [PRODUCT/SERVICE].'
  },
  {
    id: 'limited-quantity',
    name: 'Limited Quantity',
    description: 'Emphasize scarcity of product availability',
    category: 'urgency',
    examples: ['Only 5 left', 'Limited stock', 'While supplies last'],
    promptTemplate: 'Generate 3 [PLATFORM] Ads that emphasize scarcity and limited availability. Show that users need to act now before stock runs out. The product is: [PRODUCT/SERVICE].'
  },
  
  // Social Proof Triggers
  {
    id: 'customer-count',
    name: 'Customer Count',
    description: 'Highlight large number of customers or users',
    category: 'social-proof',
    examples: ['Join 10,000+ customers', 'Trusted by millions', 'Industry leading'],
    promptTemplate: 'Create 3 [PLATFORM] Ads that showcase popularity and widespread usage. Emphasize customer count and mass adoption. The product/service is: [PRODUCT/SERVICE].'
  },
  {
    id: 'testimonials',
    name: 'Testimonials & Reviews',
    description: 'Feature positive feedback from satisfied customers',
    category: 'social-proof',
    examples: ['5-star reviews', 'See what others say', 'Rated 4.8/5'],
    promptTemplate: 'Write 3 [PLATFORM] Ads based on social validation through reviews and testimonials. Focus on what others think and positive experiences. For: [PRODUCT/SERVICE].'
  },
  
  // Value Proposition Triggers
  {
    id: 'clear-benefit',
    name: 'Clear Benefit',
    description: 'State the primary benefit clearly and directly',
    category: 'value-proposition',
    examples: ['Save time', 'Boost sales', 'Double your reach'],
    promptTemplate: 'Generate 3 benefit-driven [PLATFORM] Ads that focus on clear outcomes and results. Each ad should communicate a tangible value. For: [PRODUCT/SERVICE].'
  },
  {
    id: 'roi-focused',
    name: 'ROI Focused',
    description: 'Emphasize return on investment or savings',
    category: 'value-proposition',
    examples: ['Save $100 monthly', '10x your investment', 'Costs less than coffee'],
    promptTemplate: 'Create 3 ROI-focused [PLATFORM] Ads that highlight cost savings, financial benefits, or investment return. For: [PRODUCT/SERVICE].'
  },
  
  // Authority & Expertise Triggers
  {
    id: 'industry-expert',
    name: 'Industry Expert',
    description: 'Position as an authority or expert in the field',
    category: 'authority',
    examples: ['Certified experts', 'Since 2004', 'Industry leader'],
    promptTemplate: 'Write 3 [PLATFORM] Ads that establish credibility and authority. Emphasize expertise, credentials, or industry leadership. For: [PRODUCT/SERVICE].'
  },
  {
    id: 'proven-system',
    name: 'Proven System/Method',
    description: 'Highlight proven methods or proprietary systems',
    category: 'authority',
    examples: ['Proven results', 'Patent-pending', 'Research-backed'],
    promptTemplate: 'Create 3 [PLATFORM] Ads focusing on proven methods, systems, or research-backed approaches. Show certainty of results. For: [PRODUCT/SERVICE].'
  },
  
  // Curiosity & Intrigue Triggers
  {
    id: 'secret-reveal',
    name: 'Secret Reveal',
    description: 'Tease exclusive information or a "secret" approach',
    category: 'curiosity',
    examples: ['The secret to...', 'What experts don\'t tell you', 'Hidden method'],
    promptTemplate: 'Generate 3 curiosity-based [PLATFORM] Ads that tease exclusive information or secrets. Create information gaps that make users want to learn more. For: [PRODUCT/SERVICE].'
  },
  {
    id: 'surprising-fact',
    name: 'Surprising Fact/Statistic',
    description: 'Lead with an unexpected fact or statistic',
    category: 'curiosity',
    examples: ['Surprising fact:', '90% of people don\'t know', 'You won\'t believe'],
    promptTemplate: 'Write 3 [PLATFORM] Ads that use surprising facts, statistics, or counter-intuitive statements to grab attention. For: [PRODUCT/SERVICE].'
  },
  
  // Emotional Appeal Triggers
  {
    id: 'pain-point',
    name: 'Pain Point Focus',
    description: 'Address a specific pain point or frustration',
    category: 'emotional',
    examples: ['Tired of...', 'Frustrated with...', 'Say goodbye to...'],
    promptTemplate: 'Create 3 empathetic [PLATFORM] Ads that address specific pain points or frustrations. Show understanding of challenges and offer relief. For: [PRODUCT/SERVICE].'
  },
  {
    id: 'aspiration',
    name: 'Aspirational Appeal',
    description: 'Connect to aspirations, dreams, or ideal outcomes',
    category: 'emotional',
    examples: ['Achieve your dreams', 'Be your best self', 'Transform your life'],
    promptTemplate: 'Generate 3 aspirational [PLATFORM] Ads that connect with the dreams, goals, or ideal future state of your audience. For: [PRODUCT/SERVICE].'
  }
];

export const getCategoryInfo = (categoryId: string): TriggerCategoryInfo | undefined => {
  return triggerCategories.find(cat => cat.id === categoryId);
};

export const getTriggersByCategory = (categoryId: string): MentalTrigger[] => {
  return mentalTriggers.filter(trigger => trigger.category === categoryId);
};
