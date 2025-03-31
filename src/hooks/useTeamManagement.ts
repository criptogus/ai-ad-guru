
import { useState, useEffect } from "react";
import { getTeamMembers } from "@/services/team/members";
import { getTeamInvitations, resendInvitation, revokeInvitation } from "@/services/team/invitations";
import { TeamMember, UserRole } from "@/services/types";
import { toast } from "sonner";
import { getRolePermissions } from "@/services/team/roles";
import { inviteUser, updateTeamMemberRole } from "@/services/team/members";

export const useTeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Get role permissions
  const rolePermissions = getRolePermissions();

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Load team members
      const members = await getTeamMembers();
      setTeamMembers(members);
      
      // Load pending invitations
      const pendingInvitations = await getTeamInvitations();
      setInvitations(pendingInvitations);
    } catch (error) {
      toast.error("Failed to load team data", {
        description: "There was an error loading the team members and invitations. Please try again."
      });
      console.error("Error loading team data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle sending invitation
  const handleSendInvitation = async (email: string, role: UserRole) => {
    setIsSubmitting(true);
    try {
      await inviteUser(email, role);
      setShowInviteModal(false);
      await loadData(); // Refresh data
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation", {
        description: "There was an error sending the invitation. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle resending invitation
  const handleResendInvitation = async (id: string): Promise<boolean> => {
    try {
      return await resendInvitation(id);
    } catch (error) {
      console.error("Error resending invitation:", error);
      return false;
    }
  };

  // Handle revoking invitation
  const handleRevokeInvitation = async (id: string): Promise<boolean> => {
    try {
      return await revokeInvitation(id);
    } catch (error) {
      console.error("Error revoking invitation:", error);
      return false;
    }
  };

  // Handle updating team member role
  const handleUpdateTeamMemberRole = async (id: string, role: UserRole): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const success = await updateTeamMemberRole(id, role);
      
      if (success) {
        toast.success("Role updated", {
          description: "The team member's role has been updated successfully."
        });
        
        // Refresh data
        await loadData();
        setShowEditModal(false);
        return true;
      } else {
        throw new Error("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating team member role:", error);
      toast.error("Failed to update role", {
        description: "There was an error updating the team member's role. Please try again."
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle selecting a member for editing
  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  // Get badge variant based on role
  const getBadgeVariant = (role: UserRole): "default" | "secondary" | "outline" => {
    switch (role) {
      case "Admin":
        return "default";
      case "Editor":
        return "secondary";
      case "Analyst":
      case "Viewer":
      default:
        return "outline";
    }
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
