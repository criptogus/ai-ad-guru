
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/components/roles/InviteUserModal";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastActive: string;
}

// Function to invite a user to the team
export const inviteUser = async (email: string, role: UserRole): Promise<void> => {
  console.log(`Inviting ${email} as ${role}`);
  
  try {
    // Check if the user is already in the team
    const { data: existingMembers } = await supabase
      .from('team_members')
      .select('email')
      .eq('email', email)
      .single();
    
    if (existingMembers) {
      throw new Error('User with this email is already a team member');
    }
    
    // Create an invitation record in Supabase
    const { error } = await supabase
      .from('team_invitations')
      .insert([{ email, role }]);
      
    if (error) throw error;
    
    // Call the Supabase Edge Function to send an invitation email
    const { error: inviteError } = await supabase.functions.invoke("send-team-invitation", {
      body: { email, role }
    });
    
    if (inviteError) throw inviteError;
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error inviting user:", error);
    throw error;
  }
};

// Function to get team members - in a real app, this would fetch from Supabase
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    // Fetch actual team members from Supabase
    const { data, error } = await supabase
      .from('team_members')
      .select('*');
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map((member: any) => ({
        id: member.id,
        name: member.name || member.email.split('@')[0],
        email: member.email,
        role: member.role,
        lastActive: member.last_active || 'Never'
      }));
    }
    
    // Fallback to mock data if no real data exists
    const mockData: TeamMember[] = [
      { id: "1", name: "John Doe", email: "john@example.com", role: "Admin", lastActive: "2 hours ago" },
      { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Analyst", lastActive: "1 day ago" },
      { id: "3", name: "Robert Johnson", email: "robert@example.com", role: "Viewer", lastActive: "3 days ago" },
      { id: "4", name: "Emily Davis", email: "emily@example.com", role: "Analyst", lastActive: "Just now" },
    ];
    
    return mockData;
  } catch (error) {
    console.error("Error fetching team members:", error);
    // Return mock data as fallback in case of error
    return [
      { id: "1", name: "John Doe", email: "john@example.com", role: "Admin", lastActive: "2 hours ago" },
      { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Analyst", lastActive: "1 day ago" },
    ];
  }
};

// Function to get role permissions
export const getRolePermissions = () => {
  return {
    Admin: [
      "Manage Users",
      "Manage Billing",
      "Create Campaigns",
      "Edit Campaigns",
      "View Analytics",
      "Access API",
    ],
    Analyst: [
      "Create Campaigns",
      "Edit Campaigns",
      "View Analytics",
    ],
    Viewer: [
      "View Campaigns",
      "View Analytics",
    ],
  };
};
