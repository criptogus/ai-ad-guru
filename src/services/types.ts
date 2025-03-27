
// Define the possible credit actions
export type CreditAction = 
  | 'google_ad_creation'
  | 'meta_ad_creation'
  | 'linkedin_ad_creation'
  | 'microsoft_ad_creation'
  | 'image_generation'
  | 'website_analysis'
  | 'campaign_creation'
  | 'credit_purchase'
  | 'ai_insights_report'
  | 'smart_banner_creation'
  | 'ai_optimization_daily'
  | 'ai_optimization_3days'
  | 'ai_optimization_weekly'
  | 'credit_refund'; // Added for refund actions

// User role types
export type UserRole = 'Admin' | 'Editor' | 'Viewer' | 'Analyst';

// Team member interface
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastActive: string;
}

// Role permissions interface
export interface RolePermissions {
  [key: string]: string[];
}

// Credit usage interfaces
export interface CreditUsage {
  id: string;
  userId: string;
  action: string;
  amount: number;
  timestamp: string;
  details?: string;
}

// Optimization costs interface
export interface OptimizationCosts {
  daily: number;
  threeDays: number;
  weekly: number;
}

// Credit costs interface
export interface AllCreditCosts {
  [key: string]: number | OptimizationCosts;
}
