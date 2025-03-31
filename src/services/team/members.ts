
import { TeamMember, UserRole } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Get team members from the database
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching team members:", error);
      throw error;
    }
    
    // Map the snake_case properties from Supabase to camelCase for our TeamMember type
    return data ? data.map(member => ({
      id: member.id,
      name: member.name || '',
      email: member.email,
      role: member.role as UserRole,
      lastActive: member.last_active
    })) : [];
  } catch (error) {
    console.error("Error in getTeamMembers:", error);
    throw error;
  }
};

// Function to invite a user to the team
export const inviteUser = async (email: string, role: UserRole): Promise<void> => {
  try {
    console.log(`Inviting ${email} with role ${role}`);
    
    // Call the Supabase Edge Function to send the invitation email
    const { error } = await supabase.functions.invoke('send-team-invitation', {
      body: { email, role }
    });
    
    if (error) {
      console.error("Error invoking send-team-invitation function:", error);
      throw error;
    }
    
    console.log(`Invitation to ${email} with role ${role} sent successfully`);
  } catch (error) {
    console.error("Error inviting user:", error);
    throw error;
  }
};

// Function to update a team member's role
export const updateTeamMemberRole = async (id: string, role: UserRole): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('team_members')
      .update({ role })
      .eq('id', id);
    
    if (error) {
      console.error("Error updating team member role:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateTeamMemberRole:", error);
    return false;
  }
};

// Function to update a team member
export const updateTeamMember = async (id: string, updates: Partial<TeamMember>): Promise<boolean> => {
  try {
    // Convert camelCase to snake_case for the database
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.role !== undefined) dbUpdates.role = updates.role;
    if (updates.lastActive !== undefined) dbUpdates.last_active = updates.lastActive;
    
    const { error } = await supabase
      .from('team_members')
      .update(dbUpdates)
      .eq('id', id);
    
    if (error) {
      console.error("Error updating team member:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateTeamMember:", error);
    return false;
  }
};

// Function to remove a team member
export const removeTeamMember = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error removing team member:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in removeTeamMember:", error);
    return false;
  }
};
