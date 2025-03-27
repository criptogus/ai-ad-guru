
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getCreditCost, CreditAction } from "./creditCosts";

// Function to check if user has enough credits
export const checkUserCredits = async (userId: string, amount: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user credits:", error);
      return false;
    }

    if (!data) {
      console.warn("User not found");
      return false;
    }

    const userCredits = data.credits;
    return userCredits >= amount;
  } catch (error) {
    console.error("Error checking user credits:", error);
    return false;
  }
};

// Function to deduct credits from user
export const deductUserCredits = async (
  userId: string,
  amount: number,
  action: CreditAction,
  description?: string
): Promise<boolean> => {
  try {
    // Ensure amount is not negative
    if (amount < 0) {
      console.warn("Attempted to deduct a negative amount of credits.");
      return false;
    }

    // Get the actual cost from the creditCosts configuration
    const creditCost = getCreditCost(action);

    // Verify that the amount to deduct matches the expected cost
    if (amount !== creditCost) {
      console.warn(`Deduct amount (${amount}) does not match expected cost (${creditCost}) for action ${action}`);
    }

    // Optimistic update: Deduct credits first and revert if there's an error
    const { error: updateError } = await supabase.rpc('deduct_credits', {
      user_id: userId,
      credit_deduction: amount,
      action_type: action,
      description_text: description || `Deducted ${amount} credits for ${action}`
    });

    if (updateError) {
      console.error("Error deducting credits:", updateError);
      toast("Credit Deduction Failed", {
        description: "There was an error deducting credits. Please try again.",
      });
      return false;
    }

    toast("Credits Deducted", {
      description: `Successfully deducted ${amount} credits for ${action}`,
    });
    return true;
  } catch (error) {
    console.error("Error during credit deduction:", error);
    toast("Credit Deduction Error", {
      description: "An error occurred while deducting credits. Please try again.",
    });
    return false;
  }
};
