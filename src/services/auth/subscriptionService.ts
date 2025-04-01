
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if a user has an active subscription based on the profile data
 * 
 * @param userId The user ID to check subscription for
 * @returns Promise<boolean> True if the user has an active subscription
 */
export const checkUserSubscription = async (userId: string): Promise<boolean> => {
  try {
    console.log('Checking subscription status for user:', userId);
    
    // Get profile data which includes has_paid flag
    const { data, error } = await supabase
      .from('profiles')
      .select('has_paid')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
    
    return !!data?.has_paid;
  } catch (error) {
    console.error('Exception checking subscription status:', error);
    return false;
  }
}

/**
 * Makes a call to Stripe to verify subscription status
 * This would be a backup or more accurate check when needed
 * 
 * @param userId The user ID to check subscription for
 * @returns Promise<boolean> True if the user has an active subscription
 */
export const verifySubscriptionWithStripe = async (userId: string): Promise<boolean> => {
  try {
    console.log('Verifying subscription with Stripe for user:', userId);
    
    // Call the edge function to verify with Stripe
    const { data, error } = await supabase.functions.invoke('verify-subscription', {
      body: { userId }
    });
    
    if (error) {
      console.error('Error verifying subscription with Stripe:', error);
      return false;
    }
    
    console.log('Stripe verification result:', data);
    return !!data?.active;
  } catch (error) {
    console.error('Exception verifying subscription with Stripe:', error);
    return false;
  }
}

/**
 * Syncs the subscription status from Stripe to our database
 * This can be called periodically or after specific events
 * 
 * @param userId The user ID to sync subscription for
 * @returns Promise<boolean> True if the sync was successful
 */
export const syncSubscriptionStatus = async (userId: string): Promise<boolean> => {
  try {
    // First verify with Stripe
    const isActive = await verifySubscriptionWithStripe(userId);
    
    // Then update our database
    const { error } = await supabase
      .from('profiles')
      .update({ has_paid: isActive })
      .eq('id', userId);
      
    if (error) {
      console.error('Error updating subscription status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception syncing subscription status:', error);
    return false;
  }
}
