
import { supabase } from "@/integrations/supabase/client";
import { checkCreditsForAction, deductUserCredits } from "./creditChecks";
import { CreditAction } from "@/services/types";

/**
 * Consume credits for a specific action
 * This function will check if a user has enough credits and then deduct them
 */
export const consumeCredits = async (
  userId: string,
  amount: number,
  action: CreditAction,
  description: string
): Promise<boolean> => {
  try {
    // Check if a user has enough credits
    const { hasEnoughCredits } = await checkCreditsForAction(userId, action, amount);
    
    if (!hasEnoughCredits) {
      return false;
    }
    
    // Deduct credits
    return await deductUserCredits(userId, amount, action, description);
  } catch (error) {
    console.error("Error consuming credits:", error);
    return false;
  }
};

/**
 * Get credit usage history for a user
 */
export const getCreditUsageHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("credit_usage")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching credit usage history:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getCreditUsageHistory:", error);
    return [];
  }
};
