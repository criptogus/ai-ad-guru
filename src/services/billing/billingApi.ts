
import { supabase } from '@/integrations/supabase/client';

/**
 * Billing Service API
 * This service encapsulates all billing-related operations
 */
export const billingApi = {
  /**
   * Get user subscription status
   */
  getUserSubscription: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('has_paid')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Update user subscription status
   */
  updateSubscriptionStatus: async (userId: string, hasPaid: boolean) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ has_paid: hasPaid })
      .eq('id', userId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Create a checkout session
   */
  createCheckoutSession: async ({ userId, amount, productName }: { 
    userId: string, 
    amount?: number, 
    productName?: string
  }) => {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { 
        userId,
        amount,
        productName,
        returnUrl: `${window.location.origin}/billing`
      }
    });
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Verify payment
   */
  verifyPayment: async (sessionId: string) => {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { sessionId }
    });
    
    if (error) throw error;
    return data;
  }
};
