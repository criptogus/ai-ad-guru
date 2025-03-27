
import { supabase } from "@/integrations/supabase/client";
import { CreditAction } from "@/services/types";
import { toast } from "sonner";
import { getCreditCosts } from "./creditCosts";

// Credit costs are now managed in a separate file to avoid duplication

/**
 * Check if a user has enough credits for an action and returns current credit balance
 */
export const checkCreditsForAction = async (
  userId: string,
  action: CreditAction,
  amount?: number
): Promise<{ hasEnoughCredits: boolean; currentCredits: number }> => {
  try {
    // Get user's current credits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching user credits:", profileError);
      return { hasEnoughCredits: false, currentCredits: 0 };
    }

    // Get cost of the action
    const costs = getCreditCosts();
    const cost = amount !== undefined ? amount : costs[action] || 0;

    // Check if user has enough credits
    const userCredits = profile?.credits || 0;
    const hasEnoughCredits = userCredits >= cost;

    return { hasEnoughCredits, currentCredits: userCredits };
  } catch (error) {
    console.error("Error checking user credits:", error);
    return { hasEnoughCredits: false, currentCredits: 0 };
  }
};

/**
 * Check if a user has enough credits for an action
 */
export const checkUserCredits = async (
  userId: string,
  action: CreditAction
): Promise<boolean> => {
  try {
    const { hasEnoughCredits, currentCredits } = await checkCreditsForAction(userId, action);
    
    if (!hasEnoughCredits) {
      // Get cost of the action
      const costs = getCreditCosts();
      const cost = costs[action] || 0;
      
      toast.error(`Not enough credits for this action`, {
        description: `You need ${cost} credits but only have ${currentCredits}.`
      });
    }

    return hasEnoughCredits;
  } catch (error) {
    console.error("Error checking user credits:", error);
    return false;
  }
};

/**
 * Deduct credits from a user for an action
 */
export const deductUserCredits = async (
  userId: string,
  actionCost: number,
  action: CreditAction,
  description: string
): Promise<boolean> => {
  try {
    // Skip if cost is 0
    if (actionCost === 0) return true;

    // Get user's current credits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching user credits:", profileError);
      return false;
    }

    const userCredits = profile?.credits || 0;
    if (userCredits < actionCost) {
      toast.error(`Not enough credits for this action`, {
        description: `You need ${actionCost} credits but only have ${userCredits}.`
      });
      return false;
    }

    // Update user's credits
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ credits: userCredits - actionCost })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating user credits:", updateError);
      return false;
    }

    // Log credit usage
    try {
      await supabase.from("credit_usage").insert({
        user_id: userId,
        amount: actionCost,
        action,
        description
      });
    } catch (error) {
      console.error("Error logging credit usage:", error);
      // Continue even if logging fails
    }

    return true;
  } catch (error) {
    console.error("Error deducting user credits:", error);
    return false;
  }
};
