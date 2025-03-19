
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/components/roles/InviteUserModal";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastActive: string;
}

// This is a mock function - in a real implementation, this would send an invite via Supabase
export const inviteUser = async (email: string, role: UserRole): Promise<void> => {
  // In a real implementation, this would use Supabase or another service to send invites
  console.log(`Inviting ${email} as ${role}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For now, we'll just log the invitation. In a real app, you would:
  // 1. Generate an invite link with a token
  // 2. Store the invitation in the database 
  // 3. Send an email to the user with the invite link
  return Promise.resolve();
};

// Mock function to get team members - in a real app, this would fetch from Supabase
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  // In a real implementation, this would fetch from your Supabase database
  const mockData: TeamMember[] = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "Admin", lastActive: "2 hours ago" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Analyst", lastActive: "1 day ago" },
    { id: "3", name: "Robert Johnson", email: "robert@example.com", role: "Viewer", lastActive: "3 days ago" },
    { id: "4", name: "Emily Davis", email: "emily@example.com", role: "Analyst", lastActive: "Just now" },
  ];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockData;
};

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
