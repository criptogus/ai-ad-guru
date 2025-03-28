
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import PendingInvitationsTable from "./PendingInvitationsTable";
import { UserRole } from "@/services/types";

interface PendingInvitationsCardProps {
  invitations: any[];
  getBadgeVariant: (role: UserRole) => "default" | "secondary" | "outline";
  onResendInvitation: (id: string) => Promise<boolean>;
  onRevokeInvitation: (id: string) => Promise<boolean>;
}

const PendingInvitationsCard: React.FC<PendingInvitationsCardProps> = ({
  invitations,
  getBadgeVariant,
  onResendInvitation,
  onRevokeInvitation
}) => {
  if (invitations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
        <CardDescription>Invitations that have been sent but not yet accepted</CardDescription>
      </CardHeader>
      <CardContent>
        <PendingInvitationsTable 
          invitations={invitations}
          getBadgeVariant={getBadgeVariant}
          onResendInvitation={onResendInvitation}
          onRevokeInvitation={onRevokeInvitation}
        />
      </CardContent>
    </Card>
  );
};

export default PendingInvitationsCard;
