
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import TeamMembersTable from "./TeamMembersTable";
import { TeamMember, UserRole } from "@/services/types";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

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
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team members and their roles</CardDescription>
        </div>
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
