
// Credit action types
export type CreditAction = 
  | 'google_ad_creation'
  | 'meta_ad_creation'
  | 'linkedin_ad_creation'
  | 'microsoft_ad_creation'
  | 'campaign_creation'
  | 'website_analysis'
  | 'image_generation'
  | 'ai_optimization_daily'
  | 'ai_optimization_3days'
  | 'ai_optimization_weekly'
  | 'ai_insights_report'
  | 'credit_purchase';

// Credit usage record
export interface CreditUsage {
  id: string;
  userId: string;
  amount: number;
  action: CreditAction;
  description: string;
  createdAt: string;
}

// Team member type
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  lastActive: string;
}

// Role permissions type
export interface RolePermissions {
  [key: string]: string[];
}
