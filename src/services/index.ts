
// Core services exports
export * from './auth';
export * from './billing';
export * from './campaign';
export * from './analytics';
export * from './ads';
export * from './media';
export * from './credits';

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
