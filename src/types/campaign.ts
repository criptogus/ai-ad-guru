
export interface ScheduleData {
  startDate?: Date | null;
  endDate?: Date | null;
  optimizationFrequency?: string;
}

export interface MindTrigger {
  name: string;
  description: string;
  icon?: React.ReactNode;
}

export interface TriggerData {
  triggers: string[];
  getActiveTrigger: (platform: string) => string | undefined;
  setActiveTrigger: (platform: string, trigger: string) => void;
}

export interface CampaignTargeting {
  age?: string[];
  gender?: string[];
  interests?: string[];
  locations?: string[];
  languages?: string[];
  devices?: string[];
  keywords?: string;
}

export interface CampaignBasicInfo {
  name: string;
  description: string;
  targetUrl: string;
  budget: number | string;
  objective: string;
}

export interface MentalTriggersSectionProps {
  platform?: string;
  activePlatform?: string;
  onInsertTrigger?: (trigger: string) => void;
  onSelectTrigger?: (trigger: string, platform: string) => void;
  mindTriggers?: Record<string, string>;
}
