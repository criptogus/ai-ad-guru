
// Re-export from credits with different name to avoid ambiguity
import { OptimizationCosts } from './credits/creditCosts';

export type { OptimizationCosts as CreditOptimizationCosts };

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
