
// User Roles and Permissions
export type UserRole = "Admin" | "Editor" | "Analyst" | "Viewer";

export type Permission = 
  | "View analytics" 
  | "Edit campaigns" 
  | "Delete campaigns" 
  | "Manage team" 
  | "Manage billing" 
  | "Configure integrations" 
  | "Export reports" 
  | "View campaigns";

// Team Member
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastActive?: string;
}

// Invitation
export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  invitationToken: string;
  expiresAt: string;
  accepted: boolean;
  createdAt: string;
}

// Campaign
export interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed" | "draft";
  budget: number;
  platform: string;
  results?: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
  };
}

// Ad Variation
export interface AdVariation {
  id: string;
  campaignId: string;
  headline?: string;
  description?: string;
  imageUrl?: string;
  platform: string;
  status: "active" | "paused" | "review" | "draft";
  performance?: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
  };
}
