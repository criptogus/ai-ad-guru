
import { getRolePermissions } from "@/services/team/roles";
import { UserRole, RolePermissions } from "@/services/types";

export const useRoleUtils = () => {
  // Get role permissions
  const rolePermissions: RolePermissions = getRolePermissions();

  // Get badge variant based on role
  const getBadgeVariant = (role: UserRole): "default" | "secondary" | "outline" => {
    switch (role) {
      case "Admin":
        return "default";
      case "Editor":
        return "secondary";
      case "Analyst":
      case "Viewer":
      default:
        return "outline";
    }
  };

  return {
    rolePermissions,
    getBadgeVariant
  };
};
