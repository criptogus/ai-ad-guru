
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '../types';

export const getTeamInvitations = async (teamId: string) => {
  const { data, error } = await supabase
    .from('team_invitations')
    .select('*')
    .eq('team_id', teamId);

  if (error) {
    console.error('Error fetching team invitations:', error);
    throw error;
  }

  return data || [];
};

export const inviteUser = async (email: string, role: UserRole, teamId: string) => {
  try {
    // Create a new invitation in the database
    const { data, error } = await supabase.functions.invoke('send-team-invitation', {
      body: {
        email,
        role,
        teamId
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error inviting user:', error);
    throw error;
  }
};

export const resendInvitation = async (invitationId: string) => {
  try {
    const { data, error } = await supabase
      .from('team_invitations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', invitationId)
      .select()
      .single();

    if (error) throw error;

    // Call the email sending function again
    await supabase.functions.invoke('send-team-invitation', {
      body: { 
        invitationId: data.id,
        resend: true
      }
    });

    return true;
  } catch (error) {
    console.error('Error resending invitation:', error);
    return false;
  }
};

export const revokeInvitation = async (invitationId: string) => {
  try {
    const { error } = await supabase
      .from('team_invitations')
      .delete()
      .eq('id', invitationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error revoking invitation:', error);
    return false;
  }
};
