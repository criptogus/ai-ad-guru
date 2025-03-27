
/**
 * Billing Types
 * Defines types used in the billing system
 */

// Checkout session
export interface CheckoutSession {
  id: string;
  url: string;
  status: string;
}

// Subscription details
export interface SubscriptionDetails {
  id: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan: {
    id: string;
    name: string;
    amount: number;
    currency: string;
    interval: string;
  };
}

// Credit purchase history item
export interface CreditPurchase {
  id: string;
  amount: number;
  credits: number;
  status: string;
  date: string;
  paymentMethod?: string;
}

// Invoice history item
export interface Invoice {
  id: string;
  amount: number;
  status: string;
  date: string;
  description: string;
  pdfUrl?: string;
}

// Payment verification result
export interface PaymentVerificationResult {
  verified: boolean;
  session?: {
    id: string;
    status: string;
    payment_status?: string;
  };
  message?: string;
  warning?: string;
  error?: string;
}
