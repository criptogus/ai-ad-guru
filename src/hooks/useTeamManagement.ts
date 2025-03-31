
import { useState } from "react";
import { TeamMember, UserRole } from "@/services/types";
import { useTeamMembers } from "./team/useTeamMembers";
import { useTeamInvitations } from "./team/useTeamInvitations";
import { useRoleUtils } from "./team/useRoleUtils";

export const useTeamManagement = () => {
  const {
    teamMembers,
    isLoading: isLoadingMembers,
    isSubmitting: isSubmittingMembers,
    selectedMember,
    setSelectedMember,
    showEditModal,
    setShowEditModal,
    handleEditMember,
    handleUpdateTeamMemberRole,
    loadTeamMembers
  } = useTeamMembers();

  const {
    invitations,
    isLoading: isLoadingInvitations,
    isSubmitting: isSubmittingInvitations,
    showInviteModal,
    setShowInviteModal,
    handleSendInvitation,
    handleResendInvitation,
    handleRevokeInvitation,
    loadInvitations
  } = useTeamInvitations();

  const { rolePermissions, getBadgeVariant } = useRoleUtils();

  // Combined loading and submitting states
  const isLoading = isLoadingMembers || isLoadingInvitations;
  const isSubmitting = isSubmittingMembers || isSubmittingInvitations;

  // Combined data loading function
  const loadData = async () => {
    await Promise.all([loadTeamMembers(), loadInvitations()]);
  };

  return {
    teamMembers,
    invitations,
    isLoading,
    isSubmitting,
    showInviteModal,
    setShowInviteModal,
    showEditModal,
    setShowEditModal,
    selectedMember,
    rolePermissions,
    getBadgeVariant,
    handleSendInvitation,
    handleResendInvitation,
    handleRevokeInvitation,
    handleUpdateTeamMemberRole,
    handleEditMember,
    loadData
  };
};
