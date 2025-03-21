
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditAction } from "../types";

// Function to check if user has enough credits for an action
export const checkCreditsForAction = async (
  userId: string, 
  action: CreditAction, 
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

// Helper function to check if the current user has enough credits
export const checkUserCredits = async (userId: string, requiredCredits: number): Promise<boolean> => {
  try {
    if (!userId) {
      console.error("No user ID provided");
      return false;
    }
    
    const { hasEnoughCredits } = await checkCreditsForAction(userId, 'credit_purchase', requiredCredits);
    return hasEnoughCredits;
  } catch (error) {
    console.error("Error checking user credits:", error);
    return false;
  }
};

// Helper function to deduct credits from the current user
export const deductUserCredits = async (
  userId: string,
  amount: number,
  action: CreditAction,
  description: string
): Promise<boolean> => {
  try {
    if (!userId) {
      console.error("No user ID provided");
      return false;
    }
    
    // Import dynamically to avoid circular dependencies
    const { consumeCredits } = await import('./creditUsage');
    return await consumeCredits(userId, amount, action, description);
  } catch (error) {
    console.error("Error deducting user credits:", error);
    return false;
  }
};
