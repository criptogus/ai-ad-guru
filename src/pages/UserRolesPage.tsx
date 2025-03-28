
import React from "react";
import SafeAppLayout from "@/components/SafeAppLayout";
import { Card } from "@/components/ui/card";
import { useTeamManagement } from "@/hooks/useTeamManagement";
import TeamMembersCard from "@/components/roles/TeamMembersCard";
import PendingInvitationsCard from "@/components/roles/PendingInvitationsCard";
import RolesPermissionsCard from "@/components/roles/RolesPermissionsCard";
import InviteUserModal from "@/components/roles/InviteUserModal";
import EditTeamMemberModal from "@/components/roles/EditTeamMemberModal";

const UserRolesPage: React.FC = () => {
  const {
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
  } = useTeamManagement();

  return (
    <SafeAppLayout activePage="settings">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Team Roles & Permissions</h1>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Team Members Section */}
          <TeamMembersCard
            teamMembers={teamMembers}
            isLoading={isLoading}
            getBadgeVariant={getBadgeVariant}
            onEditMember={handleEditMember}
          />
          
          {/* Pending Invitations Section */}
          <PendingInvitationsCard
            invitations={invitations}
            getBadgeVariant={getBadgeVariant}
            onResendInvitation={handleResendInvitation}
            onRevokeInvitation={handleRevokeInvitation}
          />
          
          {/* Roles & Permissions Explanation */}
          <RolesPermissionsCard rolePermissions={rolePermissions} />
        </div>
        
        {/* Invite User Modal */}
        <InviteUserModal
          open={showInviteModal}
          onOpenChange={setShowInviteModal}
          onSendInvitation={handleSendInvitation}
          isSubmitting={isSubmitting}
        />
        
        {/* Edit Team Member Modal */}
        {selectedMember && (
          <EditTeamMemberModal
            open={showEditModal}
            onOpenChange={setShowEditModal}
            teamMember={selectedMember}
            onUpdateRole={handleUpdateTeamMemberRole}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </SafeAppLayout>
  );
};

export default UserRolesPage;
