
// Import types from creditCosts
import { creditCosts } from './credits/creditCosts';

// Define OptimizationCosts type explicitly
export interface CreditOptimizationCosts {
  daily: number;
  every3Days: number;
  weekly: number;
}

// Define user roles
export type UserRole = 'admin' | 'editor' | 'viewer';

export const userRoles: UserRole[] = ['admin', 'editor', 'viewer'];

export const getRolePermissions = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return {
        canCreateCampaigns: true,
        canEditCampaigns: true,
        canDeleteCampaigns: true,
        canInviteUsers: true,
        canManageTeam: true,
        canViewBilling: true
      };
    case 'editor':
      return {
        canCreateCampaigns: true,
        canEditCampaigns: true,
        canDeleteCampaigns: false,
        canInviteUsers: false,
        canManageTeam: false,
        canViewBilling: false
      };
    case 'viewer':
      return {
        canCreateCampaigns: false,
        canEditCampaigns: false,
        canDeleteCampaigns: false,
        canInviteUsers: false,
        canManageTeam: false,
        canViewBilling: false
      };
  }
};
