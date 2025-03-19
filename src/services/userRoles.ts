
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/components/roles/InviteUserModal";
import { toast } from "sonner";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastActive: string;
}

export interface CreditUsage {
  id: string;
  userId: string;
  amount: number;
  action: 'campaign_creation' | 'ai_optimization' | 'image_generation';
  description: string;
  createdAt: string;
}

// Function to invite a user to the team
export const inviteUser = async (email: string, role: UserRole): Promise<void> => {
  console.log(`Inviting ${email} as ${role}`);
  
  try {
    // Call the Supabase Edge Function to send an invitation email
    const { error: inviteError } = await supabase.functions.invoke("send-team-invitation", {
      body: { email, role }
    });
    
    if (inviteError) throw inviteError;
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error inviting user:", error);
    throw error;
  }
};

// Function to get team members - in a real app, this would fetch from Supabase
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    // Mock data for now since we don't have real team_members yet
    const mockData: TeamMember[] = [
      { id: "1", name: "John Doe", email: "john@example.com", role: "Admin", lastActive: "2 hours ago" },
      { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Analyst", lastActive: "1 day ago" },
      { id: "3", name: "Robert Johnson", email: "robert@example.com", role: "Viewer", lastActive: "3 days ago" },
      { id: "4", name: "Emily Davis", email: "emily@example.com", role: "Analyst", lastActive: "Just now" },
    ];
    
    return mockData;
  } catch (error) {
    console.error("Error fetching team members:", error);
    // Return mock data as fallback in case of error
    return [
      { id: "1", name: "John Doe", email: "john@example.com", role: "Admin", lastActive: "2 hours ago" },
      { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Analyst", lastActive: "1 day ago" },
    ];
  }
};

// Function to get role permissions
export const getRolePermissions = () => {
  return {
    Admin: [
      "Manage Users",
      "Manage Billing",
      "Create Campaigns",
      "Edit Campaigns",
      "View Analytics",
      "Access API",
    ],
    Analyst: [
      "Create Campaigns",
      "Edit Campaigns",
      "View Analytics",
    ],
    Viewer: [
      "View Campaigns",
      "View Analytics",
    ],
  };
};

// Function to check if user has enough credits for an action
export const checkCreditsForAction = async (
  userId: string, 
  action: 'campaign_creation' | 'ai_optimization' | 'image_generation', 
  requiredCredits: number
): Promise<{hasEnoughCredits: boolean, currentCredits: number}> => {
  try {
    // Get the user's current credit balance
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    const currentCredits = profile?.credits || 0;
    const hasEnoughCredits = currentCredits >= requiredCredits;
    
    return { hasEnoughCredits, currentCredits };
  } catch (error) {
    console.error("Error checking credits:", error);
    toast.error("Failed to check credit balance. Please try again.");
    return { hasEnoughCredits: false, currentCredits: 0 };
  }
};

// Function to consume credits for an action
export const consumeCredits = async (
  userId: string,
  amount: number,
  action: 'campaign_creation' | 'ai_optimization' | 'image_generation',
  description: string
): Promise<boolean> => {
  try {
    // First check if the user has enough credits
    const { hasEnoughCredits, currentCredits } = await checkCreditsForAction(userId, action, amount);
    
    if (!hasEnoughCredits) {
      toast.error(`Insufficient credits. You need ${amount} credits but only have ${currentCredits}.`);
      return false;
    }
    
    // Update the user's credit balance
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        credits: currentCredits - amount
      })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    // Log the credit usage
    const { error: logError } = await supabase
      .from('credit_usage')
      .insert({
        user_id: userId,
        amount: amount,
        action: action,
        description: description
      });
    
    if (logError) {
      console.error("Error logging credit usage:", logError);
      // Continue even if logging fails
    }
    
    toast.success(`${amount} credits have been used for ${description}.`);
    return true;
  } catch (error) {
    console.error("Error consuming credits:", error);
    toast.error("Failed to process credits. Please try again.");
    return false;
  }
};

// Function to get credit usage history
export const getCreditUsageHistory = async (userId: string): Promise<CreditUsage[]> => {
  try {
    const { data, error } = await supabase
      .from('credit_usage')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      amount: item.amount,
      action: item.action,
      description: item.description,
      createdAt: item.created_at
    })) || [];
  } catch (error) {
    console.error("Error fetching credit usage history:", error);
    return [];
  }
};

// Function to add credits to a user's account
export const addCredits = async (userId: string, amount: number, reason: string): Promise<boolean> => {
  try {
    // Get current credits
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    const currentCredits = profile?.credits || 0;
    
    // Update credits
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        credits: currentCredits + amount
      })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    // Log the credit addition
    const { error: logError } = await supabase
      .from('credit_usage')
      .insert({
        user_id: userId,
        amount: -amount, // Negative amount signifies credits added
        action: 'credit_purchase',
        description: reason
      });
    
    if (logError) {
      console.error("Error logging credit addition:", logError);
      // Continue even if logging fails
    }
    
    toast.success(`${amount} credits have been added to your account.`);
    return true;
  } catch (error) {
    console.error("Error adding credits:", error);
    toast.error("Failed to add credits. Please try again.");
    return false;
  }
};

// Function to get credit cost for different actions
export const getCreditCosts = () => {
  return {
    campaignCreation: 5,
    aiOptimization: {
      daily: 10,
      every3Days: 5,
      weekly: 2
    },
    imageGeneration: 5
  };
};

