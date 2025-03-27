
import { supabase } from "@/integrations/supabase/client";
import { CreditAction } from "../types";
import { getCreditCosts } from "./creditCosts";

// Function to check if user has enough credits for an action
export const checkCreditsForAction = async (
  userId: string,
  action: CreditAction,
  quantity: number = 1
): Promise<{ hasEnoughCredits: boolean; currentCredits: number; requiredCredits: number }> => {
  try {
    // Get current user credits
    const { data: user, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    const currentCredits = user?.credits || 0;
    const creditCosts = getCreditCosts();
    
    let requiredCredits = 0;
    
    // Calculate required credits based on action
    switch (action) {
      case 'google_ad_creation':
        requiredCredits = creditCosts.googleAds * quantity;
        break;
      case 'meta_ad_creation':
        requiredCredits = creditCosts.metaAds * quantity;
        break;
      case 'linkedin_ad_creation':
        requiredCredits = creditCosts.linkedinAds * quantity;
        break;
      case 'microsoft_ad_creation':
        requiredCredits = creditCosts.microsoftAds * quantity;
        break;
      case 'campaign_creation':
        requiredCredits = creditCosts.campaignCreation * quantity;
        break;
      case 'website_analysis':
        requiredCredits = creditCosts.websiteAnalysis * quantity;
        break;
      case 'image_generation':
        requiredCredits = creditCosts.imageGeneration * quantity;
        break;
      case 'ai_optimization_daily':
        requiredCredits = creditCosts.aiOptimization.daily * quantity;
        break;
      case 'ai_optimization_3days':
        requiredCredits = creditCosts.aiOptimization.every3Days * quantity;
        break;
      case 'ai_optimization_weekly':
        requiredCredits = creditCosts.aiOptimization.weekly * quantity;
        break;
      case 'ai_insights_report':
        requiredCredits = creditCosts.aiInsightsReport * quantity;
        break;
      case 'credit_purchase':
        requiredCredits = 0; // Adding credits doesn't consume credits
        break;
      default:
        requiredCredits = 1 * quantity; // Default to 1 credit per action
    }
    
    return {
      hasEnoughCredits: currentCredits >= requiredCredits,
      currentCredits,
      requiredCredits
    };
  } catch (error) {
    console.error("Error checking credits:", error);
    // Return false in case of error to prevent actions that might require credits
    return { hasEnoughCredits: false, currentCredits: 0, requiredCredits: 0 };
  }
};

// New function to check user credits (simplified version)
export const checkUserCredits = async (userId: string, requiredCredits: number): Promise<boolean> => {
  try {
    // Get current user credits
    const { data: user, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error checking user credits:", error);
      return false;
    }
    
    const currentCredits = user?.credits || 0;
    return currentCredits >= requiredCredits;
    
  } catch (error) {
    console.error("Error in checkUserCredits:", error);
    return false;
  }
};

// New function to deduct credits from user
export const deductUserCredits = async (
  userId: string, 
  amount: number, 
  action: CreditAction | string,
  description: string
): Promise<boolean> => {
  try {
    // Get current user credits
    const { data: user, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error getting user credits:", error);
      return false;
    }
    
    const currentCredits = user?.credits || 0;
    
    if (currentCredits < amount) {
      console.error("Not enough credits");
      return false;
    }
    
    // Update user credits
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: currentCredits - amount })
      .eq('id', userId);
    
    if (updateError) {
      console.error("Error updating credits:", updateError);
      return false;
    }
    
    // Log credit usage
    try {
      // Try to log the credit usage to a credit_usage table if it exists
      await supabase
        .from('credit_usage')
        .insert({
          user_id: userId,
          amount: amount,
          action: action,
          description: description,
        });
    } catch (logError) {
      // If the table doesn't exist, just log to console
      console.log("Credit usage logging not available:", logError);
    }
    
    return true;
  } catch (error) {
    console.error("Error in deductUserCredits:", error);
    return false;
  }
};
