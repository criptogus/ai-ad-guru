
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
