
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
