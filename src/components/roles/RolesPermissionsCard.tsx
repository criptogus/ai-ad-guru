
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RolesPermissionsCardProps {
  rolePermissions: { [key: string]: string[] };
}

const RolesPermissionsCard: React.FC<RolesPermissionsCardProps> = ({ rolePermissions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles & Permissions</CardTitle>
        <CardDescription>Define what each role can do</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(rolePermissions).map(([role, permissions]) => (
            <div key={role} className="border rounded-lg p-4">
              <h3 className="text-lg font-medium">{role}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {role === "Admin" ? "Full access to all features and settings" : 
                 role === "Analyst" ? "Can view analytics and create reports" : 
                 role === "Editor" ? "Can create and edit campaigns" :
                 "Can only view campaigns and analytics"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {permissions.map((permission) => (
                  <Badge key={permission} variant="outline">{permission}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RolesPermissionsCard;
