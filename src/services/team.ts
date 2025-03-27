
import { supabase } from "@/integrations/supabase/client";
import { TeamMember, RolePermissions } from "./types";

// Function to get team members
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as TeamMember[];
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
};

// Function to invite a new team member
export const inviteUser = async (email: string, role: string): Promise<boolean> => {
  try {
    // Create an invitation token (in a real app, we would send this via email)
    const invitationToken = Math.random().toString(36).substring(2, 15);
    
    // Store the invitation in the database
    const { error } = await supabase
      .from('team_invitations')
      .insert({
        email,
        role,
        invitation_token: invitationToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        accepted: false
      });
    
    if (error) throw error;
    
    // In a real app, we would send an email to the invited user with the invitation token
    console.log(`Invitation token for ${email}: ${invitationToken}`);
    
    return true;
  } catch (error) {
    console.error('Error inviting user:', error);
    return false;
  }
};

// Function to get role permissions
export const getRolePermissions = (): RolePermissions => {
  return {
    "Admin": [
      "Create Campaigns", 
      "Edit Campaigns", 
      "Delete Campaigns",
      "Manage Users",
      "Manage Billing",
      "View Analytics",
      "Connect Ad Platforms",
      "Manage Company Settings"
    ],
    "Editor": [
      "Create Campaigns", 
      "Edit Campaigns", 
      "View Analytics",
      "Connect Ad Platforms"
    ],
    "Viewer": [
      "View Campaigns",
      "View Analytics"
    ]
  };
};

// Function to accept a team invitation
export const acceptInvitation = async (token: string): Promise<boolean> => {
  try {
    // Get the invitation details
    const { data: invitation, error: fetchError } = await supabase
      .from('team_invitations')
      .select('*')
      .eq('invitation_token', token)
      .eq('accepted', false)
      .gt('expires_at', new Date().toISOString())
      .single();
    
    if (fetchError || !invitation) {
      console.error('Invalid or expired invitation token');
      return false;
    }
    
    // Add the user to the team_members table
    const { error: insertError } = await supabase
      .from('team_members')
      .insert({
        email: invitation.email,
        role: invitation.role,
        name: '', // This would be filled in when the user completes setup
        last_active: new Date().toISOString()
      });
    
    if (insertError) throw insertError;
    
    // Mark the invitation as accepted
    const { error: updateError } = await supabase
      .from('team_invitations')
      .update({ accepted: true })
      .eq('id', invitation.id);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return false;
  }
};

// Function to remove a team member
export const removeTeamMember = async (memberId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error removing team member:', error);
    return false;
  }
};
