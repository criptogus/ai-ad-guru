
import Stripe from 'https://esm.sh/stripe@12.14.0';

// Initialize and return a Stripe client
function getStripeClient() {
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!stripeKey) {
    throw new Error("Stripe API key not configured");
  }

  return new Stripe(stripeKey, {
    apiVersion: '2023-10-16',
  });
}

// Extract user ID from the Stripe session using multiple methods
async function extractUserId(session: Stripe.Checkout.Session) {
  let userId = null;
    
  // Option 1: From client_reference_id
  if (session.client_reference_id) {
    userId = session.client_reference_id;
    console.log('Found userId in client_reference_id:', userId);
    return userId;
  }
  
  // Option 2: From custom metadata
  if (session.metadata && session.metadata.userId) {
    userId = session.metadata.userId;
    console.log('Found userId in metadata:', userId);
    return userId;
  }
  
  // Option 3: From URL query parameters
  if (session.success_url && session.success_url.includes('client_reference_id=')) {
    const url = new URL(session.success_url);
    const params = new URLSearchParams(url.search);
    userId = params.get('client_reference_id');
    console.log('Found userId in success_url params:', userId);
    return userId;
  }
  
  // If no user ID found in the session data, return null
  return null;
}

// Retrieve and verify the Stripe session
export async function verifyStripePayment(sessionId: string) {
  const stripe = getStripeClient();
  let session;
  
  // Try to retrieve the session
  try {
    console.log('Attempting to retrieve session from Stripe:', sessionId);
    session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Session retrieved successfully:', {
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      client_reference_id: session.client_reference_id,
      customer: session.customer,
      subscription: session.subscription,
    });
  } catch (stripeError) {
    console.error('Error retrieving session from Stripe:', stripeError);
    
    // Try retrieving the session again with expanded properties
    try {
      console.log('Attempting to retrieve session with expanded properties');
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['customer', 'payment_intent', 'subscription']
      });
      console.log('Session retrieved with expanded properties');
    } catch (expandedError) {
      console.error('Error retrieving expanded session:', expandedError);
      throw new Error(`Could not retrieve session: ${stripeError.message}`);
    }
  }

  // Extract user ID from session data
  let userId = await extractUserId(session);
  
  // Check if payment was successful
  const paymentSuccessful = session.payment_status === 'paid' || session.status === 'complete';
  
  return {
    session,
    success: paymentSuccessful,
    userId
  };
}
