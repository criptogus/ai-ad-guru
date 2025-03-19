
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
    // Mock data for now since we don't have real team_members yet
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
