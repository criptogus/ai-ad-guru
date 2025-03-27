
/**
 * Billing Service Types
 * Type definitions for billing-related functionality
 */

export interface CheckoutSession {
  id: string;
  url: string;
  amount: number;
  currency: string;
  productName: string;
  credits?: number;
}

export interface SubscriptionDetails {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodEnd: string;
  plan: {
    id: string;
    name: string;
    amount: number;
    currency: string;
    interval: 'month' | 'year';
  };
  cancelAtPeriodEnd: boolean;
}

export interface CreditPurchase {
  id: string;
  amount: number;
  credits: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'draft';
  createdAt: string;
  pdfUrl?: string;
  description: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  sessionId?: string;
  customerId?: string;
  credits?: number;
  error?: string;
}
