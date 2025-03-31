
import { useState, useEffect } from "react";
import { TeamMember, UserRole } from "@/services/types";
import { getTeamMembers, updateTeamMemberRole } from "@/services/team/members";
import { toast } from "sonner";

export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load team members
  const loadTeamMembers = async () => {
    try {
      setIsLoading(true);
      const members = await getTeamMembers();
      setTeamMembers(members);
      return members;
    } catch (error) {
      console.error("Error loading team members:", error);
      toast.error("Failed to load team members", {
        description: "There was an error loading the team members. Please try again."
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selecting a member for editing
  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowEditModal(true);
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

  useEffect(() => {
    loadTeamMembers();
  }, []);

  return {
    teamMembers,
    isLoading,
    isSubmitting,
    selectedMember,
    setSelectedMember,
    showEditModal,
    setShowEditModal,
    handleEditMember,
    handleUpdateTeamMemberRole,
    loadTeamMembers
  };
};
