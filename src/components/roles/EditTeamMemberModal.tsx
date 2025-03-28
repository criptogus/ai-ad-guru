
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole, TeamMember } from "@/services/types";
import { Label } from "@/components/ui/label";

interface EditTeamMemberModalProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onUpdateRole: (id: string, role: UserRole) => Promise<boolean>;
  isSubmitting: boolean;
  teamMember: TeamMember;
  member?: TeamMember;
}

const EditTeamMemberModal: React.FC<EditTeamMemberModalProps> = ({
  open,
  isOpen,
  onOpenChange,
  onClose,
  onUpdateRole,
  isSubmitting,
  teamMember,
  member
}) => {
  const actualMember = teamMember || member;
  const [selectedRole, setSelectedRole] = React.useState<UserRole>(
    actualMember?.role || "Editor"
  );

  // Use either isOpen or open prop for backward compatibility
  const isModalOpen = isOpen !== undefined ? isOpen : open;
  const handleCloseModal = onClose || (() => onOpenChange && onOpenChange(false));

  // Update selected role when the member changes
  React.useEffect(() => {
    if (actualMember) {
      setSelectedRole(actualMember.role);
    }
  }, [actualMember]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actualMember) return;
    
    const success = await onUpdateRole(actualMember.id, selectedRole);
    if (success) {
      handleCloseModal();
    }
  };

  if (!actualMember) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Team Member Role</DialogTitle>
          <DialogDescription>
            Update the role for {actualMember?.name || actualMember?.email}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Analyst">Analyst</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeamMemberModal;
