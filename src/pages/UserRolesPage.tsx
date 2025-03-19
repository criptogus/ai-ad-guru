
import React from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, UserPlus } from "lucide-react";

const UserRolesPage = () => {
  // Mock data for users and roles
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", lastActive: "2 hours ago" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor", lastActive: "1 day ago" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "Viewer", lastActive: "3 days ago" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", role: "Editor", lastActive: "Just now" },
  ];

  return (
    <AppLayout activePage="roles">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User Roles</h1>
            <p className="text-muted-foreground">
              Manage user access and permissions
            </p>
          </div>
          <Button>
            <UserPlus size={16} className="mr-2" />
            Invite User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your team members and their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={
                        user.role === "Admin" ? "default" : 
                        user.role === "Editor" ? "secondary" : "outline"
                      }>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roles & Permissions</CardTitle>
            <CardDescription>Define what each role can do</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium">Admin</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Full access to all features and settings
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">Manage Users</Badge>
                  <Badge variant="outline">Manage Billing</Badge>
                  <Badge variant="outline">Create Campaigns</Badge>
                  <Badge variant="outline">Edit Campaigns</Badge>
                  <Badge variant="outline">View Analytics</Badge>
                  <Badge variant="outline">Access API</Badge>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium">Editor</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Can create and edit campaigns, view analytics
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">Create Campaigns</Badge>
                  <Badge variant="outline">Edit Campaigns</Badge>
                  <Badge variant="outline">View Analytics</Badge>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium">Viewer</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Can only view campaigns and analytics
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">View Campaigns</Badge>
                  <Badge variant="outline">View Analytics</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default UserRolesPage;
