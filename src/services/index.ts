
// Core services exports
export * from './auth';
export * from './billing';
export * from './campaign';
export * from './analytics';
export * from './credits';

// Ads and media services (with explicit exports to avoid ambiguity)
import * as adsService from './ads';
export { adsService };

import * as mediaService from './media';
export { mediaService };

// Shared libraries exports
export * from './libs/supabase-client';
export * from './libs/error-handling';
export * from './libs/api-client';

// Team-related exports (explicitly naming exports to avoid ambiguity)
export { 
  getRolePermissions,
  isAdmin,
  isEditor,
  isViewer 
} from './team/roles';

export {
  getTeamMembers,
  updateTeamMember,
  removeTeamMember,
  updateTeamMemberRole
} from './team/members';

export {
  getTeamInvitations,
  resendInvitation,
  revokeInvitation
} from './team/invitations';

// Export CreditUsage type to avoid import errors
export type { CreditUsage } from './credits/creditHistory';

// Export credit usage history function
export { getCreditUsageHistory } from './credits/creditHistory';
