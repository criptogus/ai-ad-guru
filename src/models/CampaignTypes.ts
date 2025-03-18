
// Ad Platform Types
export type AdPlatform = 'google' | 'meta';

// Ad Type
export type AdType = 'search' | 'display' | 'image';

// Ad Status
export type AdStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed';

// Campaign Status
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';

// Campaign Budget Type
export type BudgetType = 'daily' | 'lifetime';

// Business Info (Extracted from website)
export interface BusinessInfo {
  name: string;
  description: string;
  industry: string;
  targetAudience: string;
  suggestedKeywords: string[];
  adTone: string;
  websiteUrl: string;
  logoUrl?: string;
}

// Ad Variation interface
export interface AdVariation {
  id: string;
  campaignId: string;
  adType: AdType;
  platform: AdPlatform;
  headline?: string;
  description?: string;
  imageUrl?: string;
  callToAction?: string;
  status: AdStatus;
  performance?: AdPerformance;
  isAiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

// Campaign interface
export interface Campaign {
  id: string;
  userId: string;
  name: string;
  platform: AdPlatform;
  status: CampaignStatus;
  budget: number;
  budgetType: BudgetType;
  businessInfo: BusinessInfo;
  adType: AdType;
  adVariations: AdVariation[];
  startDate?: string;
  endDate?: string;
  performance?: CampaignPerformance;
  createdAt: string;
  updatedAt: string;
}

// Ad Performance metrics
export interface AdPerformance {
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  costPerClick: number;
  spend: number;
  lastUpdated: string;
}

// Campaign Performance metrics
export interface CampaignPerformance {
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  costPerClick: number;
  spend: number;
  roi: number;
  lastUpdated: string;
}

// Mock data generator for campaigns
export const generateMockCampaigns = (count: number = 3): Campaign[] => {
  const platforms: AdPlatform[] = ['google', 'meta'];
  const adTypes: AdType[] = ['search', 'image'];
  const statuses: CampaignStatus[] = ['active', 'paused', 'draft'];
  
  return Array(count).fill(0).map((_, index) => {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const adType = platform === 'google' ? 'search' : 'image';
    const id = `campaign-${index + 1}`;
    const variationCount = Math.floor(Math.random() * 3) + 2; // 2 to 4 variations
    
    return {
      id,
      userId: '1',
      name: `${platform === 'google' ? 'Google' : 'Meta'} Campaign ${index + 1}`,
      platform,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      budget: Math.floor(Math.random() * 1000) + 100,
      budgetType: Math.random() > 0.5 ? 'daily' : 'lifetime',
      businessInfo: {
        name: 'Acme Corporation',
        description: 'Leading provider of innovative solutions',
        industry: 'Technology',
        targetAudience: 'Small to medium businesses',
        suggestedKeywords: ['innovative solutions', 'business software', 'productivity'],
        adTone: 'Professional',
        websiteUrl: 'https://example.com',
      },
      adType,
      adVariations: generateMockAdVariations(id, platform, adType, variationCount),
      startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      performance: {
        impressions: Math.floor(Math.random() * 10000),
        clicks: Math.floor(Math.random() * 500),
        ctr: Math.random() * 0.1,
        conversions: Math.floor(Math.random() * 50),
        costPerClick: Math.random() * 2 + 0.5,
        spend: Math.floor(Math.random() * 500),
        roi: Math.random() * 5 + 1,
        lastUpdated: new Date().toISOString(),
      },
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
};

// Mock data generator for ad variations
export const generateMockAdVariations = (
  campaignId: string, 
  platform: AdPlatform, 
  adType: AdType, 
  count: number = 5
): AdVariation[] => {
  const statuses: AdStatus[] = ['active', 'paused'];
  
  return Array(count).fill(0).map((_, index) => {
    const ctr = Math.random() * 0.1;
    const clicks = Math.floor(Math.random() * 200);
    const impressions = Math.floor(clicks / ctr);
    const costPerClick = Math.random() * 2 + 0.5;
    
    return {
      id: `ad-${campaignId}-${index + 1}`,
      campaignId,
      adType,
      platform,
      headline: adType === 'search' 
        ? `Innovative Solutions ${index + 1}` 
        : undefined,
      description: adType === 'search' 
        ? 'Boost your business productivity with our leading solutions.' 
        : 'Transform your business with our innovative technology solutions.',
      imageUrl: adType === 'image' 
        ? `https://picsum.photos/seed/${campaignId}-${index}/600/600` 
        : undefined,
      callToAction: 'Learn More',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      performance: {
        impressions,
        clicks,
        ctr,
        conversions: Math.floor(clicks * Math.random() * 0.2),
        costPerClick,
        spend: Math.floor(clicks * costPerClick),
        lastUpdated: new Date().toISOString(),
      },
      isAiGenerated: Math.random() > 0.3,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
};
