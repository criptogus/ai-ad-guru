
import { supabase } from "@/integrations/supabase/client";
import { consumeCredits } from "./creditUsage";
import { CreditAction, getCreditCost } from "./creditCosts";

// Check if user has enough credits for an action
export const checkUserCredits = async (userId: string, requiredCredits: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error checking user credits:', error);
      return false;
    }
    
    return data.credits >= requiredCredits;
  } catch (error) {
    console.error('Error checking user credits:', error);
    return false;
  }
};

// Deduct user credits for an action
export const deductUserCredits = async (
  userId: string, 
  amount: number, 
  action: CreditAction,
  details?: string
): Promise<boolean> => {
  try {
    return await consumeCredits(userId, amount, action, details || '');
  } catch (error) {
    console.error('Error deducting credits:', error);
    return false;
  }
};

// Check if user has enough credits for a specific action
export const checkCreditsForAction = async (
  userId: string,
  action: CreditAction
): Promise<{ hasEnoughCredits: boolean; requiredCredits: number }> => {
  const requiredCredits = getCreditCost(action);
  
  if (!requiredCredits) {
    return { hasEnoughCredits: true, requiredCredits: 0 }; // If action doesn't require credits, return true
  }
  
  const hasCredits = await checkUserCredits(userId, requiredCredits);
  
  return { hasEnoughCredits: hasCredits, requiredCredits };
};
