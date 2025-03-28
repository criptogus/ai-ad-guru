
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, XCircle } from "lucide-react";
import { UserRole } from "@/services/types";

interface PendingInvitationsTableProps {
  invitations: any[];
  getBadgeVariant: (role: UserRole) => "default" | "secondary" | "outline";
  onResendInvitation: (id: string) => Promise<boolean>;
  onRevokeInvitation: (id: string) => Promise<boolean>;
}

const PendingInvitationsTable: React.FC<PendingInvitationsTableProps> = ({
  invitations,
  getBadgeVariant,
  onResendInvitation,
  onRevokeInvitation
}) => {
  if (!invitations || invitations.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No pending invitations</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Date Sent</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => (
          <TableRow key={invitation.id}>
            <TableCell>{invitation.email}</TableCell>
            <TableCell>
              <Badge variant={getBadgeVariant(invitation.role)}>
                {invitation.role}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(invitation.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResendInvitation(invitation.id)}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Resend
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onRevokeInvitation(invitation.id)}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Revoke
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PendingInvitationsTable;
