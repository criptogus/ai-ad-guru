
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

export type UserRole = "Admin" | "Analyst" | "Viewer";

export const roleDescriptions = {
  Admin: "Full access to all features, including user management",
  Analyst: "Can view and analyze data, but cannot manage users",
  Viewer: "Read-only access to dashboards and campaigns",
};

interface InviteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (email: string, role: UserRole) => Promise<void>;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  open,
  onOpenChange,
  onInvite,
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("Viewer");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email is required",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await onInvite(email, role);
      setEmail("");
      onOpenChange(false);
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
      });
    } catch (error) {
      toast({
        title: "Failed to send invitation",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Analyst">Analyst</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            {role && (
              <p className="text-sm text-muted-foreground mt-1">
                {roleDescriptions[role]}
              </p>
            )}
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserModal;
