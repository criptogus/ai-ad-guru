
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { TeamMember, UserRole } from "@/services/types";
import TeamMembersCard from "@/components/roles/TeamMembersCard";
import PendingInvitationsCard from "@/components/roles/PendingInvitationsCard";
import RolesPermissionsCard from "@/components/roles/RolesPermissionsCard";
import InviteUserModal from "@/components/roles/InviteUserModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const UserRolesPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Define role permissions
  const rolePermissions = {
    "Admin": ["View analytics", "Edit campaigns", "Delete campaigns", "Manage team", "Manage billing", "Configure integrations"],
    "Editor": ["View analytics", "Edit campaigns", "Configure integrations"],
    "Analyst": ["View analytics", "Export reports"],
    "Viewer": ["View analytics", "View campaigns"]
  };

  // Get badge variant based on role
  const getBadgeVariant = (role: UserRole): "default" | "secondary" | "outline" => {
    switch (role) {
      case "Admin":
        return "default";
      case "Editor":
        return "secondary";
      case "Analyst":
      case "Viewer":
        return "outline";
      default:
        return "outline";
    }
  };

  // Fetch team members and invitations
  const fetchRolesData = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from Supabase
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('*');

      if (membersError) throw membersError;

      // Also fetch pending invitations
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('accepted', false);

      if (invitationsError) throw invitationsError;

      setTeamMembers(membersData || []);
      setInvitations(invitationsData || []);
    } catch (error) {
      console.error("Error fetching team data:", error);
      toast({
        title: "Failed to load team data",
        description: "There was an error loading the team information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesData();
  }, []);

  // Handle sending invitation
  const handleSendInvitation = async (email: string, role: UserRole) => {
    try {
      // Generate a random token and expiration date
      const token = Math.random().toString(36).substring(2, 15);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      // Store invitation in the database
      const { error } = await supabase.from('team_invitations').insert({
        email,
        role,
        invitation_token: token,
        expires_at: expiresAt.toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
      });

      // Refresh data
      fetchRolesData();
      setShowInviteModal(false);
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Failed to send invitation",
        description: "There was an error sending the invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle resending invitation
  const handleResendInvitation = async (id: string) => {
    try {
      // In a real app, this would resend the email
      toast({
        title: "Invitation resent",
        description: "The invitation has been resent.",
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast({
        title: "Failed to resend invitation",
        description: "There was an error resending the invitation. Please try again.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  // Handle revoking invitation
  const handleRevokeInvitation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Invitation revoked",
        description: "The invitation has been revoked.",
      });

      // Refresh data
      fetchRolesData();
      return Promise.resolve();
    } catch (error) {
      console.error("Error revoking invitation:", error);
      toast({
        title: "Failed to revoke invitation",
        description: "There was an error revoking the invitation. Please try again.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  return (
    <AppLayout activePage="roles">
      <div className="container px-4 py-6 mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Team Management</h1>
            <p className="text-muted-foreground mt-1">Manage your team members and their permissions</p>
          </div>
          <Button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Invite Team Member
          </Button>
        </div>

        <div className="space-y-6">
          <TeamMembersCard 
            isLoading={isLoading} 
            teamMembers={teamMembers} 
            getBadgeVariant={getBadgeVariant} 
          />
          
          <PendingInvitationsCard 
            invitations={invitations} 
            getBadgeVariant={getBadgeVariant}
            onResendInvitation={handleResendInvitation}
            onRevokeInvitation={handleRevokeInvitation}
          />
          
          <RolesPermissionsCard rolePermissions={rolePermissions} />
        </div>

        <InviteUserModal 
          open={showInviteModal}
          onOpenChange={setShowInviteModal}
          onSendInvitation={handleSendInvitation}
        />
      </div>
    </AppLayout>
  );
};

export default UserRolesPage;
