
import { TeamMember, UserRole } from "../types";
import { supabase } from "@/integrations/supabase/client";

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

// Function to invite a user to the team
export const inviteUser = async (email: string, role: UserRole): Promise<void> => {
  console.log(`Inviting ${email} with role ${role}`);
  
  // In a real app, would create an invitation in Supabase
  // and send an email to the user
  
  try {
    // Simulating an API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This would typically involve:
    // 1. Creating a record in an "invitations" table
    // 2. Sending an email via a serverless function
    // 3. Handling the invitation acceptance flow
    
    console.log(`Invitation to ${email} with role ${role} sent successfully`);
  } catch (error) {
    console.error("Error inviting user:", error);
    throw error;
  }
};
