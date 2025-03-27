
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditAction, CreditUsage } from "../types";
import { checkCreditsForAction } from "./creditChecks";

// Function to consume credits for an action
export const consumeCredits = async (
  userId: string,
  amount: number,
  action: CreditAction,
  description: string
): Promise<boolean> => {
  try {
    // First check if the user has enough credits
    const { hasEnoughCredits, currentCredits } = await checkCreditsForAction(userId, action, amount);
    
    if (!hasEnoughCredits && amount > 0) {
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
    
    // Log the credit usage in the database
    try {
      await supabase.from('credit_usage').insert({
        user_id: userId,
        amount: amount,
        action,
        description
      });
    } catch (error) {
      console.error("Error logging credit usage:", error);
      // Continue even if logging fails
    }
    
    if (amount > 0) {
      toast.success(`${amount} credits have been used for ${description}.`, {
        duration: 3000,
      });
    } else if (amount < 0) {
      toast.success(`${Math.abs(amount)} credits have been refunded for ${description}.`, {
        duration: 3000,
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error consuming credits:", error);
    toast.error("Failed to process credits. Please try again.", {
      duration: 5000,
    });
    return false;
  }
};

// Function to get credit usage history
export const getCreditUsageHistory = async (userId: string): Promise<CreditUsage[]> => {
  try {
    // Get usage from the database
    const { data, error } = await supabase
      .from('credit_usage')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []) as CreditUsage[];
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
    try {
      await supabase.from('credit_usage').insert({
        user_id: userId,
        amount: -amount, // Negative amount signifies credits added
        action: 'credit_purchase',
        description: reason
      });
    } catch (error) {
      console.error("Error logging credit purchase:", error);
      // Continue even if logging fails
    }
    
    toast.success(`${amount} credits have been added to your account.`, {
      duration: 3000,
    });
    return true;
  } catch (error) {
    console.error("Error adding credits:", error);
    toast.error("Failed to add credits. Please try again.", {
      duration: 5000,
    });
    return false;
  }
};
