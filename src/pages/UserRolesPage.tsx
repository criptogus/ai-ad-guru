
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import InviteUserModal, { UserRole } from "@/components/roles/InviteUserModal";
import { getTeamMembers, getRolePermissions, inviteUser, TeamMember } from "@/services/userRoles";
import { useToast } from "@/hooks/use-toast";

const UserRolesPage = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const rolePermissions = getRolePermissions();

  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        setIsLoading(true);
        const members = await getTeamMembers();
        setTeamMembers(members);
      } catch (error) {
        toast({
          title: "Failed to load team members",
          description: "There was an error loading the team members. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTeamMembers();
  }, [toast]);

  const handleInviteUser = async (email: string, role: UserRole) => {
    await inviteUser(email, role);
    // In a real app, we would refresh the team members list here
  };

  const getBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "Admin":
        return "default";
      case "Analyst":
        return "secondary";
      case "Viewer":
        return "outline";
      default:
        return "outline";
    }
  };

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
          <Button onClick={() => setIsInviteModalOpen(true)}>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading team members...
                    </TableCell>
                  </TableRow>
                ) : teamMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No team members yet. Invite someone to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(member.role)}>
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
              {Object.entries(rolePermissions).map(([role, permissions]) => (
                <div key={role} className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium">{role}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {role === "Admin" ? "Full access to all features and settings" : 
                     role === "Analyst" ? "Can create and edit campaigns, view analytics" : 
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
      </div>
      
      <InviteUserModal 
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        onInvite={handleInviteUser}
      />
    </AppLayout>
  );
};

export default UserRolesPage;
