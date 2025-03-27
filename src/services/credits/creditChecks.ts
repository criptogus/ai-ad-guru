
import { supabase } from "@/integrations/supabase/client";
import { CreditAction } from "@/services/types";
import { toast } from "sonner";

// Credit costs for different actions
export const getCreditCosts = () => ({
  google_ad_creation: 5,
  meta_ad_creation: 5,
  linkedin_ad_creation: 5,
  microsoft_ad_creation: 5,
  image_generation: 1,
  website_analysis: 1,
  ai_optimization_daily: 10,
  ai_optimization_3days: 5,
  ai_optimization_weekly: 2,
  campaign_creation: 0,
  ai_insights_report: 3,
  smart_banner_creation: 2
});

/**
 * Check if a user has enough credits for an action
 */
export const checkUserCredits = async (
  userId: string,
  action: CreditAction
): Promise<boolean> => {
  try {
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

    // Get cost of the action
    const costs = getCreditCosts();
    const cost = costs[action] || 0;

    // Check if user has enough credits
    const userCredits = profile?.credits || 0;
    const hasEnoughCredits = userCredits >= cost;

    if (!hasEnoughCredits) {
      toast.error(`Not enough credits for this action`, {
        description: `You need ${cost} credits but only have ${userCredits}.`
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
  action: CreditAction,
  description: string
): Promise<boolean> => {
  try {
    // Get cost of the action
    const costs = getCreditCosts();
    const cost = costs[action] || 0;

    // Skip if cost is 0
    if (cost === 0) return true;

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
    if (userCredits < cost) {
      toast.error(`Not enough credits for this action`, {
        description: `You need ${cost} credits but only have ${userCredits}.`
      });
      return false;
    }

    // Update user's credits
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ credits: userCredits - cost })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating user credits:", updateError);
      return false;
    }

    // Log credit usage
    try {
      await supabase.from("credit_usage").insert({
        user_id: userId,
        amount: cost,
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
