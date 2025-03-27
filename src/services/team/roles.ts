
import { RolePermissions } from "../types";

// Function to get role permissions
export const getRolePermissions = (): RolePermissions => {
  return {
    Admin: [
      "Manage Users",
      "Manage Billing",
      "Create Campaigns",
      "Edit Campaigns",
      "View Analytics",
      "Access API",
    ],
    Editor: [
      "Create Campaigns",
      "Edit Campaigns",
      "View Analytics",
      "Configure Platforms",
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
