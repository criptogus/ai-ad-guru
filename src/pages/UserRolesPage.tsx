
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import InviteUserModal from "@/components/roles/InviteUserModal";
import { inviteUser } from "@/services/team/invitations";
import { getRolePermissions } from "@/services/team/roles";
import { UserRole } from "@/services/types";
import { toast } from "sonner";
import { useTeamManagement } from "@/hooks/useTeamManagement";
import TeamMembersCard from "@/components/roles/TeamMembersCard";
import PendingInvitationsCard from "@/components/roles/PendingInvitationsCard";
import RolesPermissionsCard from "@/components/roles/RolesPermissionsCard";

const UserRolesPage = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { 
    teamMembers, 
    invitations, 
    isLoading, 
    loadData, 
    handleResendInvitation, 
    handleRevokeInvitation, 
    getBadgeVariant 
  } = useTeamManagement();
  
  const rolePermissions = getRolePermissions();

  const handleInviteUser = async (email: string, role: UserRole) => {
    try {
      await inviteUser(email, role);
      // Refresh the team members and invitations list after successful invitation
      loadData();
    } catch (error) {
      toast.error("Failed to send invitation", {
        description: "There was an error processing the invitation. Please try again."
      });
      console.error("Error inviting user:", error);
    }
  };

  return (
    <AppLayout activePage="team">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User Roles & Permissions</h1>
            <p className="text-muted-foreground">
              Manage team members, assign roles, and control access permissions
            </p>
          </div>
          <Button onClick={() => setIsInviteModalOpen(true)}>
            <UserPlus size={16} className="mr-2" />
            Invite User
          </Button>
        </div>

        <TeamMembersCard 
          isLoading={isLoading} 
          teamMembers={teamMembers} 
          getBadgeVariant={getBadgeVariant} 
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
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        onInvite={handleInviteUser}
      />
    </AppLayout>
  );
};

export default UserRolesPage;
