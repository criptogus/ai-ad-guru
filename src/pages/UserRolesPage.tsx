
import React from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import TeamMembersCard from "@/components/roles/TeamMembersCard";
import PendingInvitationsCard from "@/components/roles/PendingInvitationsCard";
import RolesPermissionsCard from "@/components/roles/RolesPermissionsCard";
import InviteUserModal from "@/components/roles/InviteUserModal";
import EditTeamMemberModal from "@/components/roles/EditTeamMemberModal";
import { useTeamManagement } from "@/hooks/useTeamManagement";

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
    handleEditMember
  } = useTeamManagement();

  return (
    <AppLayout activePage="roles">
      <div className="w-full p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Team Management</h1>
              <p className="text-muted-foreground mt-1">Manage your team members and their permissions</p>
            </div>
            <Button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Invite Team Member
            </Button>
          </div>

          <div className="space-y-6">
            <TeamMembersCard 
              isLoading={isLoading} 
              teamMembers={teamMembers} 
              getBadgeVariant={getBadgeVariant}
              onEditMember={handleEditMember}
            />
            
            <PendingInvitationsCard 
              invitations={invitations} 
              getBadgeVariant={getBadgeVariant}
              onResendInvitation={handleResendInvitation}
              onRevokeInvitation={handleRevokeInvitation}
            />
            
            <RolesPermissionsCard rolePermissions={rolePermissions} />
          </div>

          <InviteUserModal 
            open={showInviteModal}
            onOpenChange={setShowInviteModal}
            onSendInvitation={handleSendInvitation}
            isSubmitting={isSubmitting}
          />

          <EditTeamMemberModal
            open={showEditModal}
            onOpenChange={setShowEditModal}
            onUpdateRole={handleUpdateTeamMemberRole}
            isSubmitting={isSubmitting}
            teamMember={selectedMember}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default UserRolesPage;
