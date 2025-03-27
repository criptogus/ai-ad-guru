/**
 * Billing API Service
 * Handles communication with the payment processor
 */

import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/services/libs/error-handling';
import type { 
  CheckoutSession, 
  SubscriptionDetails, 
  CreditPurchase, 
  Invoice,
  PaymentVerificationResult
} from './types';

/**
 * Create a checkout session for payment
 */
export const createCheckoutSession = async (
  userId: string,
  amount: number,
  price: number,
  productName: string,
  successUrl: string,
  cancelUrl: string
): Promise<CheckoutSession | null> => {
  try {
    // Call Supabase Edge Function to create checkout session
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        userId,
        amount,
        price,
        productName,
        successUrl,
        cancelUrl
      }
    });
    
    if (error) {
      throw error;
    }
    
    return data as CheckoutSession;
  } catch (error) {
    errorLogger.logError(error, 'createCheckoutSession');
    return null;
  }
};

/**
 * Verify payment after successful checkout
 */
export const verifyPayment = async (
  sessionId: string
): Promise<PaymentVerificationResult> => {
  try {
    // Call Supabase Edge Function to verify payment
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { sessionId }
    });
    
    if (error) {
      throw error;
    }
    
    return data as PaymentVerificationResult;
  } catch (error) {
    errorLogger.logError(error, 'verifyPayment');
    return {
      verified: false,
      error: error.message || 'Failed to verify payment'
    };
  }
};

/**
 * Get subscription details for a user
 */
export const getSubscriptionDetails = async (
  userId: string
): Promise<SubscriptionDetails | null> => {
  try {
    // In a real app, this would fetch from the database or Stripe API
    // Mock implementation for now
    return {
      id: 'sub_12345',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      plan: {
        id: 'plan_pro',
        name: 'Professional',
        amount: 9900,
        currency: 'usd',
        interval: 'month'
      },
      cancelAtPeriodEnd: false
    };
  } catch (error) {
    errorLogger.logError(error, 'getSubscriptionDetails');
    return null;
  }
};

/**
 * Cancel a subscription
 */
export const cancelSubscription = async (
  userId: string, 
  subscriptionId: string
): Promise<boolean> => {
  try {
    // In a real app, this would call Stripe API
    console.log(`Canceling subscription ${subscriptionId} for user ${userId}`);
    
    // Mock implementation for now
    return true;
  } catch (error) {
    errorLogger.logError(error, 'cancelSubscription');
    return false;
  }
};

/**
 * Get user's subscription
 */
export const getUserSubscription = async (
  userId: string
): Promise<SubscriptionDetails | null> => {
  try {
    return await getSubscriptionDetails(userId);
  } catch (error) {
    errorLogger.logError(error, 'getUserSubscription');
    return null;
  }
};

/**
 * Get credit purchase history for a user
 */
export const getCreditPurchaseHistory = async (
  userId: string
): Promise<CreditPurchase[]> => {
  try {
    // In a real app, this would fetch from the database
    // Mock implementation for now
    return [
      {
        id: 'purchase_123',
        amount: 4900,
        credits: 100,
        status: 'completed',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: 'card'
      },
      {
        id: 'purchase_456',
        amount: 9900,
        credits: 250,
        status: 'completed',
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: 'card'
      }
    ];
  } catch (error) {
    errorLogger.logError(error, 'getCreditPurchaseHistory');
    return [];
  }
};

/**
 * Get invoice history for a user
 */
export const getInvoiceHistory = async (
  userId: string
): Promise<Invoice[]> => {
  try {
    // In a real app, this would fetch from Stripe API
    // Mock implementation for now
    return [
      {
        id: 'inv_123',
        amount: 4900,
        status: 'paid',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        pdfUrl: 'https://example.com/invoice/123.pdf',
        description: '100 Credits'
      },
      {
        id: 'inv_456',
        amount: 9900,
        status: 'paid',
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        pdfUrl: 'https://example.com/invoice/456.pdf',
        description: '250 Credits'
      }
    ];
  } catch (error) {
    errorLogger.logError(error, 'getInvoiceHistory');
    return [];
  }
};
