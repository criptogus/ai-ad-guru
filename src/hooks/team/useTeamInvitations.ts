
import { useState, useEffect } from "react";
import { UserRole } from "@/services/types";
import { getTeamInvitations, resendInvitation, revokeInvitation } from "@/services/team/invitations";
import { inviteUser } from "@/services/team/members";
import { toast } from "sonner";

export const useTeamInvitations = () => {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Load invitations
  const loadInvitations = async () => {
    try {
      setIsLoading(true);
      const pendingInvitations = await getTeamInvitations();
      setInvitations(pendingInvitations);
      return pendingInvitations;
    } catch (error) {
      console.error("Error loading team invitations:", error);
      toast.error("Failed to load invitations", {
        description: "There was an error loading the team invitations. Please try again."
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending invitation
  const handleSendInvitation = async (email: string, role: UserRole): Promise<void> => {
    setIsSubmitting(true);
    try {
      await inviteUser(email, role);
      setShowInviteModal(false);
      await loadInvitations(); // Refresh data
      toast.success("Invitation sent successfully", {
        description: `An invitation has been sent to ${email}`
      });
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
      const result = await resendInvitation(id);
      if (result) {
        await loadInvitations(); // Refresh data
      }
      return result;
    } catch (error) {
      console.error("Error resending invitation:", error);
      return false;
    }
  };

  // Handle revoking invitation
  const handleRevokeInvitation = async (id: string): Promise<boolean> => {
    try {
      const result = await revokeInvitation(id);
      if (result) {
        await loadInvitations(); // Refresh data
      }
      return result;
    } catch (error) {
      console.error("Error revoking invitation:", error);
      return false;
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  return {
    invitations,
    isLoading,
    isSubmitting,
    showInviteModal,
    setShowInviteModal,
    handleSendInvitation,
    handleResendInvitation,
    handleRevokeInvitation,
    loadInvitations
  };
};
