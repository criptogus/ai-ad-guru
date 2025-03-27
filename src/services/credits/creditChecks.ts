
import { supabase } from "@/integrations/supabase/client";
import { consumeCredits } from "./creditUsage";
import { CreditAction } from "../types";
import { getCreditCost } from "./creditCosts";

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
    return await consumeCredits(userId, amount, action, details);
  } catch (error) {
    console.error('Error deducting credits:', error);
    return false;
  }
};

// Check if user has enough credits for a specific action and deduct them if they do
export const checkCreditsForAction = async (
  userId: string,
  action: CreditAction,
  details?: string
): Promise<boolean> => {
  const requiredCredits = getCreditCost(action);
  
  if (!requiredCredits) {
    return true; // If action doesn't require credits, return true
  }
  
  const hasCredits = await checkUserCredits(userId, requiredCredits);
  
  if (!hasCredits) {
    return false;
  }
  
  return await deductUserCredits(userId, requiredCredits, action, details);
};
