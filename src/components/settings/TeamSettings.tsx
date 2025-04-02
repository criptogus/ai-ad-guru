
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TeamMembersCard from "@/components/roles/TeamMembersCard";
import PendingInvitationsCard from "@/components/roles/PendingInvitationsCard";
import RolesPermissionsCard from "@/components/roles/RolesPermissionsCard";
import InviteUserModal from "@/components/roles/InviteUserModal";
import EditTeamMemberModal from "@/components/roles/EditTeamMemberModal";
import { useTeamManagement } from "@/hooks/useTeamManagement";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const TeamSettings: React.FC = () => {
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Team Management</CardTitle>
            <CardDescription>Manage your team members and their permissions</CardDescription>
          </div>
          <Button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Invite Team Member
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
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
      </CardContent>
    </Card>
  );
};

export default TeamSettings;
