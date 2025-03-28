
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TeamMember, UserRole } from "@/services/types";
import { Edit } from "lucide-react";

interface TeamMembersTableProps {
  isLoading: boolean;
  teamMembers: TeamMember[];
  getBadgeVariant: (role: UserRole) => "default" | "secondary" | "outline";
  onEditMember: (member: TeamMember) => void;
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  isLoading,
  teamMembers,
  getBadgeVariant,
  onEditMember,
}) => {
  return (
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
              <TableCell className="font-medium">{member.name || "No name"}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(member.role as UserRole)}>
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell>{member.lastActive ? new Date(member.lastActive).toLocaleString() : "Never"}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEditMember(member)}
                >
                  <Edit size={14} className="mr-1" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TeamMembersTable;
