
import { supabase } from "@/integrations/supabase/client";
import { TeamMember, UserRole, RolePermissions } from "./types";

// Mock function to get team members (would connect to Supabase in production)
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  // In a real app, would fetch from Supabase
  // For now, return mock data
  return [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      lastActive: "2023-07-21T15:30:00Z",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Editor",
      lastActive: "2023-07-20T10:15:00Z",
    },
    {
      id: "3",
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "Viewer",
      lastActive: "2023-07-19T09:45:00Z",
    },
  ];
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

// Function to get role permissions
export const getRolePermissions = (): RolePermissions => {
  return {
    Admin: [
      "Manage users",
      "Create campaigns",
      "Edit campaigns",
      "Delete campaigns",
      "View analytics",
      "Manage billing",
      "Configure platforms",
      "Manage company settings",
    ],
    Editor: [
      "Create campaigns",
      "Edit campaigns",
      "View analytics",
      "Configure platforms",
    ],
    Viewer: [
      "View campaigns",
      "View analytics",
    ],
    Analyst: [
      "View campaigns",
      "View analytics",
      "Export reports",
      "Create insights",
    ],
  };
};

// Function to check if a user has a specific permission
export const hasPermission = (userRole: UserRole, permission: string): boolean => {
  const permissions = getRolePermissions();
  return permissions[userRole]?.includes(permission) ?? false;
};
