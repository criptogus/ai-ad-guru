
import { RolePermissions, Permission } from "../types";

// Function to get role permissions
export const getRolePermissions = (): RolePermissions => {
  return {
    Admin: [
      "Manage team",
      "Manage billing",
      "Create campaigns",
      "Edit campaigns",
      "View analytics",
      "Configure integrations",
    ],
    Editor: [
      "Create campaigns",
      "Edit campaigns",
      "View analytics",
      "Configure platforms",
    ],
    Analyst: [
      "View campaigns",
      "View analytics",
      "Create insights",
    ],
    Viewer: [
      "View campaigns",
      "View analytics",
    ],
  };
};

// Helper functions for role checks
export const isAdmin = (role: string): boolean => role === 'Admin';
export const isEditor = (role: string): boolean => role === 'Editor' || role === 'Admin';
export const isViewer = (role: string): boolean => true; // Everyone can view
export const canCreateCampaigns = (role: string): boolean => 
  role === 'Admin' || role === 'Editor'; // Only Admin and Editor can create campaigns
