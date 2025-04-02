
// Core services exports
export * from './auth';
export * from './billing';
export * from './campaign';
export * from './analytics';

// Re-export from credits with renames to avoid any conflicts
export {
  CREDIT_COSTS,
  getCreditCost,
  calculateTotalCreditCost,
  getUserCredits,
  getCreditTransactions,
  addCreditsApi,
  useCredits,
  hasEnoughCreditsApi,
  consumeCredits,
  addUserCredits,
  checkCreditSufficiency,
  getUserCreditHistory,
  getCreditUsageHistory,
  getCreditUsageSummary,
  getCreditBalanceHistory,
  checkUserCredits,
  deductUserCredits,
  type CreditUsage,
  type CreditAction,
  type CreditTransaction,
  type CreditTransactionType
} from './credits';

// Ads and media services (with explicit exports to avoid ambiguity)
import * as adsService from './ads';
export { adsService };

import * as mediaService from './media';
export { mediaService };

// Shared libraries exports
export * from './libs/supabase-client';
export * from './libs/auth-helpers';
export * from './libs/error-handling';
export * from './libs/api-client';

// Explicitly re-export team-related functions to maintain backward compatibility
export { 
  getRolePermissions,
  isAdmin,
  isEditor,
  isViewer
} from './team/roles';

export { 
  getTeamMembers,
  inviteUser as inviteTeamMember,
  updateTeamMember,
  removeTeamMember
} from './team/members';

export { 
  inviteUser,
  getTeamInvitations,
  resendInvitation,
  revokeInvitation
} from './team/invitations';
