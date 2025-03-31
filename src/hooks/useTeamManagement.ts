
import { useState, useEffect } from "react";
import { getTeamMembers } from "@/services/team/members";
import { getTeamInvitations, resendInvitation, revokeInvitation } from "@/services/team/invitations";
import { TeamMember, UserRole } from "@/services/types";
import { toast } from "sonner";

export const useTeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleResendInvitation = async (id: string) => {
    try {
      const success = await resendInvitation(id);
      if (success) {
        loadData(); // Refresh the data
      }
    } catch (error) {
      console.error("Error resending invitation:", error);
    }
  };

  const handleRevokeInvitation = async (id: string) => {
    try {
      const success = await revokeInvitation(id);
      if (success) {
        loadData(); // Refresh the data
      }
    } catch (error) {
      console.error("Error revoking invitation:", error);
    }
  };

  const getBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "Admin":
        return "default";
      case "Analyst":
        return "secondary";
      case "Editor":
      case "Viewer":
      default:
        return "outline";
    }
  };

  return {
    teamMembers,
    invitations,
    isLoading,
    loadData,
    handleResendInvitation,
    handleRevokeInvitation,
    getBadgeVariant
  };
};
