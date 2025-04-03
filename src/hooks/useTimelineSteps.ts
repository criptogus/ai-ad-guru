
import { useCallback } from 'react';
import { TimelineStep } from '@/components/campaign/CampaignTimeline';

export interface CampaignTimelineInfo {
  status: string;
  createdAt: string;
  reviewedAt?: string;
  optimizedAt?: string;
  analyzedAt?: string;
  linkedInConnected?: boolean;
}

export const useTimelineSteps = (campaignInfo: CampaignTimelineInfo, campaignId: string) => {
  const handleAnalyze = useCallback(() => {
    // In a real app, this would trigger the analysis process
    console.log(`Analyzing campaign ${campaignId}`);
    alert('Analysis request submitted. Results will be available soon.');
  }, [campaignId]);

  const getTimelineSteps = useCallback((): TimelineStep[] => {
    const steps: TimelineStep[] = [
      {
        id: 'created',
        title: 'Campaign created',
        status: 'completed',
        timeframe: 'Completed',
        description: 'Campaign was set up and submitted for review.'
      },
      {
        id: 'review',
        title: 'Campaign review',
        status: campaignInfo.reviewedAt ? 'completed' : 'current',
        timeframe: '1-7 days',
        description: 'Google reviews your ad to check if it meets its policy.'
      },
      {
        id: 'optimization',
        title: 'Google optimization',
        status: campaignInfo.optimizedAt ? 'completed' : 
                campaignInfo.reviewedAt ? 'current' : 'upcoming',
        timeframe: 'Up to 14 days',
        description: 'Google optimizes your campaign to get your ad in front of the right audience.'
      },
      {
        id: 'analysis',
        title: 'Performance analysis',
        status: campaignInfo.analyzedAt ? 'completed' : 
                campaignInfo.optimizedAt ? 'current' : 'upcoming',
        timeframe: 'After 14 days',
        description: 'Let AI analyze this campaign\'s performance and recommend ways to improve it.',
        action: {
          label: 'Analyze & Refine',
          onClick: handleAnalyze
        }
      }
    ];

    // Add LinkedIn connection step if LinkedIn is used in the campaign
    if (campaignInfo.linkedInConnected !== undefined) {
      steps.splice(1, 0, {
        id: 'linkedin',
        title: 'LinkedIn Connected',
        status: campaignInfo.linkedInConnected ? 'completed' : 'current',
        timeframe: 'Required',
        description: 'Connect your LinkedIn account to manage LinkedIn ads.',
        action: campaignInfo.linkedInConnected ? undefined : {
          label: 'Connect LinkedIn',
          onClick: () => window.location.href = '/connections'
        }
      });
    }

    return steps;
  }, [campaignInfo, handleAnalyze]);

  return { getTimelineSteps };
};
