
import { useMemo } from 'react';

export interface Trigger {
  id: string;
  name: string;
  description: string;
  platform: string[];
  category?: string;
}

export const useTriggerData = () => {
  const triggers = useMemo<Trigger[]>(() => [
    {
      id: 'scarcity',
      name: 'Scarcity',
      description: 'Create a sense of limited availability or time constraint',
      platform: ['google', 'meta', 'linkedin', 'microsoft'],
      category: 'urgency'
    },
    {
      id: 'social_proof',
      name: 'Social Proof',
      description: 'Highlight how others have benefited from your product or service',
      platform: ['google', 'meta', 'linkedin', 'microsoft'],
      category: 'trust'
    },
    {
      id: 'fear_of_missing_out',
      name: 'FOMO',
      description: 'Leverage the fear of missing out on a valuable opportunity',
      platform: ['google', 'meta', 'linkedin', 'microsoft'],
      category: 'urgency'
    },
    {
      id: 'problem_solution',
      name: 'Problem-Solution',
      description: 'Present a common problem and position your product as the solution',
      platform: ['google', 'meta', 'linkedin', 'microsoft'],
      category: 'value'
    },
    {
      id: 'authority',
      name: 'Authority',
      description: 'Establish credibility and expertise in your field',
      platform: ['google', 'meta', 'linkedin', 'microsoft'],
      category: 'trust'
    },
    {
      id: 'curiosity',
      name: 'Curiosity',
      description: 'Create intrigue with incomplete information to drive clicks',
      platform: ['google', 'meta', 'linkedin', 'microsoft'],
      category: 'engagement'
    },
    {
      id: 'value_proposition',
      name: 'Value Proposition',
      description: 'Clearly communicate the unique value your offering provides',
      platform: ['google', 'meta', 'linkedin', 'microsoft'],
      category: 'value'
    },
    {
      id: 'emotional_appeal',
      name: 'Emotional Appeal',
      description: 'Connect with users on an emotional level to drive engagement',
      platform: ['meta', 'linkedin'],
      category: 'engagement'
    },
    {
      id: 'urgency',
      name: 'Urgency',
      description: 'Create a time-sensitive reason for users to act now',
      platform: ['google', 'meta', 'linkedin', 'microsoft'],
      category: 'urgency'
    }
  ], []);

  // Get triggers for a specific platform
  const getTriggers = (platform: string) => {
    return triggers.filter(trigger => 
      trigger.platform.includes(platform.toLowerCase())
    );
  };

  // Get platform display name
  const getPlatformDisplayName = (platform: string): string => {
    switch (platform) {
      case 'google': return 'Google';
      case 'meta': return 'Instagram/Meta';
      case 'linkedin': return 'LinkedIn';
      case 'microsoft': return 'Microsoft';
      default: return platform.charAt(0).toUpperCase() + platform.slice(1);
    }
  };

  // Get platform icon
  const getPlatformIcon = (platform: string): string => {
    switch (platform) {
      case 'google': return '🔍';
      case 'meta': return '📸';
      case 'linkedin': return '💼';
      case 'microsoft': return '🪟';
      default: return '✨';
    }
  };

  return {
    triggers,
    getTriggers,
    getPlatformDisplayName,
    getPlatformIcon
  };
};
