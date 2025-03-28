
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import TeamMembersTable from "./TeamMembersTable";
import { TeamMember, UserRole } from "@/services/types";

interface TeamMembersCardProps {
  isLoading: boolean;
  teamMembers: TeamMember[];
  getBadgeVariant: (role: UserRole) => "default" | "secondary" | "outline";
  onEditMember: (member: TeamMember) => void;
}

const TeamMembersCard: React.FC<TeamMembersCardProps> = ({ 
  isLoading, 
  teamMembers, 
  getBadgeVariant,
  onEditMember
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Manage your team members and their roles</CardDescription>
      </CardHeader>
      <CardContent>
        <TeamMembersTable 
          isLoading={isLoading} 
          teamMembers={teamMembers} 
          getBadgeVariant={getBadgeVariant}
          onEditMember={onEditMember}
        />
      </CardContent>
    </Card>
  );
};

export default TeamMembersCard;
