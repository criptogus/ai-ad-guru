
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/services/types";
import { AlertCircle } from "lucide-react";

interface InviteUserModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  onSendInvitation: (email: string, role: UserRole) => Promise<boolean>;
  isSubmitting: boolean;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ 
  isOpen, 
  open,
  onClose,
  onOpenChange,
  onSendInvitation,
  isSubmitting
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("Editor");
  const [emailError, setEmailError] = useState("");

  // Use either isOpen or open prop for backward compatibility
  const isModalOpen = isOpen !== undefined ? isOpen : open;
  const handleCloseModal = onClose || (() => onOpenChange && onOpenChange(false));

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error state
    setEmailError("");
    
    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    try {
      const success = await onSendInvitation(email, role);
      if (success) {
        // Reset form after successful submission (the modal will be closed by the parent)
        setEmail("");
        setRole("Editor");
        // Close the modal
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to collaborate on your ad campaigns.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={emailError ? "border-red-500" : ""}
            />
            {emailError && (
              <div className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{emailError}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Analyst">Analyst</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            
            <p className="text-sm text-muted-foreground mt-2">
              {role === "Admin" && "Full access to all features, including team management and billing."}
              {role === "Editor" && "Can create and edit campaigns, but cannot manage the team or billing."}
              {role === "Analyst" && "Can view analytics and create reports, but cannot modify campaigns."}
              {role === "Viewer" && "Can only view campaigns and analytics. No editing permissions."}
            </p>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserModal;
