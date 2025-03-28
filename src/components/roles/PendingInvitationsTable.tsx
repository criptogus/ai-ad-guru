
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";
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
  onRevokeInvitation,
}) => {
  const [processingIds, setProcessingIds] = useState<Record<string, boolean>>({});

  const handleResend = async (id: string) => {
    setProcessingIds(prev => ({ ...prev, [id]: true }));
    await onResendInvitation(id);
    setProcessingIds(prev => ({ ...prev, [id]: false }));
  };

  const handleRevoke = async (id: string) => {
    setProcessingIds(prev => ({ ...prev, [id]: true }));
    await onRevokeInvitation(id);
    setProcessingIds(prev => ({ ...prev, [id]: false }));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Sent</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => (
          <TableRow key={invitation.id}>
            <TableCell>{invitation.email}</TableCell>
            <TableCell>
              <Badge variant={getBadgeVariant(invitation.role as UserRole)}>
                {invitation.role}
              </Badge>
            </TableCell>
            <TableCell>{new Date(invitation.created_at).toLocaleString()}</TableCell>
            <TableCell>{new Date(invitation.expires_at).toLocaleString()}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleResend(invitation.id)}
                disabled={processingIds[invitation.id]}
              >
                <RefreshCw size={14} className={`mr-1 ${processingIds[invitation.id] ? "animate-spin" : ""}`} />
                {processingIds[invitation.id] ? "Sending..." : "Resend"}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive"
                onClick={() => handleRevoke(invitation.id)}
                disabled={processingIds[invitation.id]}
              >
                <X size={14} className="mr-1" />
                Revoke
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PendingInvitationsTable;
