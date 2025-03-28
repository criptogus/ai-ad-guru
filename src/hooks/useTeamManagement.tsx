
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember, UserRole } from "@/services/types";
import { toast } from "sonner";
import { updateTeamMemberRole } from "@/services/team/members";

export const useTeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Define role permissions
  const rolePermissions = {
    "Admin": ["View analytics", "Edit campaigns", "Delete campaigns", "Manage team", "Manage billing", "Configure integrations"],
    "Editor": ["View analytics", "Edit campaigns", "Configure integrations"],
    "Analyst": ["View analytics", "Export reports"],
    "Viewer": ["View analytics", "View campaigns"]
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
        return "outline";
      default:
        return "outline";
    }
  };

  // Fetch team members and invitations
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch team members
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('*');

      if (membersError) throw membersError;

      // Fetch pending invitations
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('accepted', false);

      if (invitationsError) throw invitationsError;

      setTeamMembers(membersData || []);
      setInvitations(invitationsData || []);
    } catch (error) {
      console.error("Error fetching team data:", error);
      toast({
        title: "Failed to load team data",
        description: "There was an error loading the team information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle sending invitation
  const handleSendInvitation = async (email: string, role: UserRole): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      console.log(`Sending invitation to ${email} with role ${role}`);
      
      // Call the Supabase Edge Function to send the invitation
      const { data, error } = await supabase.functions.invoke('send-team-invitation', {
        body: { email, role }
      });
      
      if (error) {
        throw error;
      }
      
      // Even if email sending failed, the invitation record was created
      toast({
        title: data.success ? "Invitation sent" : "Invitation created",
        description: data.success 
          ? `An invitation has been sent to ${email}` 
          : `The invitation was created but the email couldn't be sent. The user can still join using the invitation link.`
      });
      
      // Refresh data
      loadData();
      setShowInviteModal(false);
      return true;
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Failed to send invitation",
        description: "There was an error sending the invitation. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle resending invitation
  const handleResendInvitation = async (id: string): Promise<boolean> => {
    try {
      // Get the invitation details
      const { data, error } = await supabase
        .from('team_invitations')
        .select('email, role')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error("Invitation not found");
      
      // Resend the invitation
      setIsSubmitting(true);
      const { error: invokeFunctionError } = await supabase.functions.invoke('send-team-invitation', {
        body: { email: data.email, role: data.role }
      });
      
      if (invokeFunctionError) throw invokeFunctionError;
      
      toast({
        title: "Invitation resent",
        description: `A new invitation email has been sent to ${data.email}`
      });
      
      return true;
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast({
        title: "Failed to resend invitation",
        description: "There was an error resending the invitation. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle revoking invitation
  const handleRevokeInvitation = async (id: string): Promise<boolean> => {
    try {
      const { error, data } = await supabase
        .from('team_invitations')
        .delete()
        .eq('id', id)
        .select('email')
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Invitation revoked",
        description: data?.email ? `The invitation to ${data.email} has been revoked` : "The invitation has been revoked"
      });
      
      // Refresh data
      loadData();
      return true;
    } catch (error) {
      console.error("Error revoking invitation:", error);
      toast({
        title: "Failed to revoke invitation",
        description: "There was an error revoking the invitation. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Handle updating team member role
  const handleUpdateTeamMemberRole = async (id: string, role: UserRole): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const success = await updateTeamMemberRole(id, role);
      
      if (success) {
        toast({
          title: "Role updated",
          description: "The team member's role has been updated successfully."
        });
        
        // Refresh data
        loadData();
        return true;
      } else {
        throw new Error("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating team member role:", error);
      toast({
        title: "Failed to update role",
        description: "There was an error updating the team member's role. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle selecting a member for editing
  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setShowEditModal(true);
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
    setSelectedMember,
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
