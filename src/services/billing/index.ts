
// Export billing functionality with explicit exports to avoid ambiguity
import { 
  createCheckoutSession,
  verifyPayment,
  getSubscriptionDetails,
  cancelSubscription as cancelSubscriptionFunc,
  getUserSubscription as getUserSubscriptionFunc,
  getCreditPurchaseHistory,
  getInvoiceHistory
} from './billingApi';

// Export with distinct names
export {
  createCheckoutSession,
  verifyPayment,
  getSubscriptionDetails,
  cancelSubscriptionFunc as cancelSubscription,
  getUserSubscriptionFunc as getUserSubscription,
  getCreditPurchaseHistory,
  getInvoiceHistory
};

// Export types
export * from './types';
