
import { Campaign as AnalyticsCampaign } from "@/components/analytics/AnalyticsOverview";
import { Campaign as CampaignType, AdPlatform, CampaignStatus, BudgetType } from "@/models/CampaignTypes";

// Create an interface that extends AnalyticsCampaign with missing properties
export interface ExtendedAnalyticsCampaign extends AnalyticsCampaign {
  performance?: CampaignType['performance'];
  budgetType?: BudgetType;
}

export const generateMockCampaigns = (): ExtendedAnalyticsCampaign[] => {
  return [
    {
      id: "campaign-1",
      name: "Google Search Campaign",
      platform: "google",
      status: "active",
      budget: 500,
      spent: 320.45,
      clicks: 1250,
      impressions: 28400,
      conversions: 42,
      ctr: 4.4,
      startDate: "2023-08-15",
      endDate: "2023-09-15",
      budgetType: "monthly" as BudgetType,
      performance: {
        impressions: 28400,
        clicks: 1250,
        ctr: 4.4,
        conversions: 42,
        costPerClick: 0.26,
        spend: 320.45,
        roi: 1.8,
        lastUpdated: new Date().toISOString()
      }
    },
    {
      id: "campaign-2",
      name: "Meta Awareness Campaign",
      platform: "meta",
      status: "active",
      budget: 750,
      spent: 523.78,
      clicks: 3420,
      impressions: 76500,
      conversions: 104,
      ctr: 4.47,
      startDate: "2023-08-01",
      endDate: "2023-09-01",
      budgetType: "monthly" as BudgetType,
      performance: {
        impressions: 76500,
        clicks: 3420,
        ctr: 4.47,
        conversions: 104,
        costPerClick: 0.15,
        spend: 523.78,
        roi: 2.1,
        lastUpdated: new Date().toISOString()
      }
    },
    {
      id: "campaign-3",
      name: "Google Display Campaign",
      platform: "google",
      status: "paused",
      budget: 300,
      spent: 142.25,
      clicks: 840,
      impressions: 24600,
      conversions: 12,
      ctr: 3.41,
      startDate: "2023-07-20",
      endDate: "2023-08-20",
      budgetType: "monthly" as BudgetType,
      performance: {
        impressions: 24600,
        clicks: 840,
        ctr: 3.41,
        conversions: 12,
        costPerClick: 0.17,
        spend: 142.25,
        roi: 1.2,
        lastUpdated: new Date().toISOString()
      }
    },
    {
      id: "campaign-4",
      name: "Meta Video Campaign",
      platform: "meta",
      status: "active",
      budget: 600,
      spent: 382.91,
      clicks: 2180,
      impressions: 42300,
      conversions: 36,
      ctr: 5.15,
      startDate: "2023-08-10",
      budgetType: "monthly" as BudgetType,
      performance: {
        impressions: 42300,
        clicks: 2180,
        ctr: 5.15,
        conversions: 36,
        costPerClick: 0.18,
        spend: 382.91,
        roi: 1.5,
        lastUpdated: new Date().toISOString()
      }
    },
    {
      id: "campaign-5",
      name: "Google Performance Max",
      platform: "google",
      status: "active",
      budget: 1000,
      spent: 876.32,
      clicks: 4120,
      impressions: 92400,
      conversions: 136,
      ctr: 4.46,
      startDate: "2023-07-01",
      budgetType: "monthly" as BudgetType,
      performance: {
        impressions: 92400,
        clicks: 4120,
        ctr: 4.46,
        conversions: 136,
        costPerClick: 0.21,
        spend: 876.32,
        roi: 2.3,
        lastUpdated: new Date().toISOString()
      }
    },
    {
      id: "campaign-6",
      name: "Meta Conversion Campaign",
      platform: "meta",
      status: "paused",
      budget: 450,
      spent: 214.67,
      clicks: 1340,
      impressions: 28900,
      conversions: 23,
      ctr: 4.64,
      startDate: "2023-08-05",
      endDate: "2023-09-05",
      budgetType: "monthly" as BudgetType,
      performance: {
        impressions: 28900,
        clicks: 1340,
        ctr: 4.64,
        conversions: 23,
        costPerClick: 0.16,
        spend: 214.67,
        roi: 1.4,
        lastUpdated: new Date().toISOString()
      }
    },
    {
      id: "campaign-7",
      name: "Google Shopping Campaign",
      platform: "google",
      status: "active",
      budget: 800,
      spent: 623.45,
      clicks: 2840,
      impressions: 54200,
      conversions: 92,
      ctr: 5.24,
      startDate: "2023-07-15",
      budgetType: "monthly" as BudgetType,
      performance: {
        impressions: 54200,
        clicks: 2840,
        ctr: 5.24,
        conversions: 92,
        costPerClick: 0.22,
        spend: 623.45,
        roi: 1.9,
        lastUpdated: new Date().toISOString()
      }
    },
    {
      id: "campaign-8",
      name: "Meta Lead Gen Campaign",
      platform: "meta",
      status: "active",
      budget: 550,
      spent: 412.32,
      clicks: 1860,
      impressions: 38700,
      conversions: 45,
      ctr: 4.81,
      startDate: "2023-08-20",
      budgetType: "monthly" as BudgetType,
      performance: {
        impressions: 38700,
        clicks: 1860,
        ctr: 4.81,
        conversions: 45,
        costPerClick: 0.22,
        spend: 412.32,
        roi: 1.6,
        lastUpdated: new Date().toISOString()
      }
    }
  ];
};

export const convertToCampaignType = (mockCampaigns: ExtendedAnalyticsCampaign[]): CampaignType[] => {
  return mockCampaigns.map(campaign => {
    // Convert the campaign to match the CampaignType interface
    const extendedCampaign: CampaignType = {
      id: campaign.id,
      name: campaign.name,
      platform: campaign.platform as AdPlatform,
      status: campaign.status as CampaignStatus,
      budget: campaign.budget,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      performance: campaign.performance,
      adVariations: [],
      userId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      budgetType: campaign.budgetType as BudgetType,
      businessInfo: {
        name: 'Acme Corporation',
        description: 'Leading provider of innovative solutions',
        industry: 'Technology',
        targetAudience: 'Small to medium businesses',
        suggestedKeywords: ['innovative solutions', 'business software', 'productivity'],
        adTone: 'Professional',
        websiteUrl: 'https://example.com',
      },
      adType: 'search'
    };
    return extendedCampaign;
  });
};
