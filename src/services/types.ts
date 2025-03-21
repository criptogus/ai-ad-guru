
import { UserRole } from "@/components/roles/InviteUserModal";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastActive: string;
}

export type CreditAction = 
  | 'campaign_creation' 
  | 'ai_optimization' 
  | 'image_generation' 
  | 'credit_purchase' 
  | 'credit_refund'
  | 'meta_ad_generation';  // Added meta_ad_generation as a valid credit action

export interface CreditUsage {
  id: string;
  userId: string;
  amount: number;
  action: CreditAction;
  description: string;
  createdAt: string;
}
