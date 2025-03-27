
import { supabase } from "@/integrations/supabase/client";
import { CreditAction } from "./creditCosts";

export interface CreditUsage {
  id: string;
  userId: string;
  amount: number;
  action: string;
  description: string;
  createdAt: string;
  details?: string;
}

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
    // First deduct the credits from the user's profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        credits: supabase.rpc('decrement_credits', { amount }) 
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error("Error updating user credits:", updateError);
      return false;
    }
    
    // Log the credit usage
    const { error: logError } = await supabase
      .from('credit_usage')
      .insert([{
        user_id: userId,
        action,
        amount,
        details: description
      }]);
    
    if (logError) {
      console.error("Error logging credit usage:", logError);
      // We already deducted the credits, so we return true anyway
      return true;
    }
    
    return true;
  } catch (error) {
    console.error("Error consuming credits:", error);
    return false;
  }
};

/**
 * Get credit usage history for a user
 */
export const getCreditUsageHistory = async (userId: string): Promise<CreditUsage[]> => {
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

    // Map the database fields to our CreditUsage interface
    return (data || []).map(item => ({
      id: item.id,
      userId: item.user_id,
      amount: item.amount,
      action: item.action,
      description: item.details || '',
      createdAt: item.created_at,
      details: item.details
    }));
  } catch (error) {
    console.error("Error in getCreditUsageHistory:", error);
    return [];
  }
};
