
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/services/types";
import { toast } from "sonner";

// Function to get all team invitations
export const getTeamInvitations = async () => {
  try {
    const { data, error } = await supabase
      .from('team_invitations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching team invitations:", error);
    throw error;
  }
};

// Function to invite a user to the team
export const inviteUser = async (email: string, role: UserRole): Promise<void> => {
  console.log(`Inviting ${email} as ${role}`);
  
  try {
    // Call the Supabase Edge Function to send an invitation email
    const { error, data } = await supabase.functions.invoke("send-team-invitation", {
      body: { email, role }
    });
    
    if (error) throw error;
    
    if (!data.success) {
      // The invitation record was created but the email failed to send
      toast.warning("Invitation created but email delivery failed", {
        description: data.error || "The invitation was recorded but we couldn't send the email. The user can still accept via the invitation link."
      });
    } else {
      // Show success message when everything works
      toast.success("Invitation sent successfully", {
        description: `An invitation email has been sent to ${email}`
      });
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error inviting user:", error);
    throw error;
  }
};

// Resend invitation
export const resendInvitation = async (id: string) => {
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
    await inviteUser(data.email, data.role as UserRole);
    
    toast.success("Invitation resent", {
      description: `A new invitation email has been sent to ${data.email}`
    });
    
    return true;
  } catch (error) {
    console.error("Error resending invitation:", error);
    toast.error("Failed to resend invitation", {
      description: error.message || "An error occurred while resending the invitation"
    });
    return false;
  }
};

// Revoke invitation
export const revokeInvitation = async (id: string) => {
  try {
    const { error, data } = await supabase
      .from('team_invitations')
      .delete()
      .eq('id', id)
      .select('email')
      .single();
    
    if (error) throw error;
    
    toast.success("Invitation revoked", {
      description: data?.email ? `The invitation to ${data.email} has been revoked` : "The invitation has been revoked"
    });
    
    return true;
  } catch (error) {
    console.error("Error revoking invitation:", error);
    toast.error("Failed to revoke invitation", {
      description: error.message || "An error occurred while revoking the invitation"
    });
    return false;
  }
};
