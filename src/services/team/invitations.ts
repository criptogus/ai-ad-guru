
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
    
    // Show appropriate toast based on the response
    if (data && data.note) {
      // We're in development mode with Resend limitations
      toast.info("Development mode notice", {
        description: "In development, emails are only sent to the Resend account owner. Invitation record was created successfully."
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
    
    return true;
  } catch (error) {
    console.error("Error resending invitation:", error);
    return false;
  }
};

// Revoke invitation
export const revokeInvitation = async (id: string) => {
  try {
    const { error } = await supabase
      .from('team_invitations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error revoking invitation:", error);
    return false;
  }
};
