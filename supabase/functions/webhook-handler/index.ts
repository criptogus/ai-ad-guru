
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import Stripe from 'https://esm.sh/stripe@12.14.0';

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Validate Stripe signature
const validateStripeSignature = (signature, body, endpointSecret, stripeKey) => {
  if (!signature || !stripeKey) return false;
  
  try {
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    stripe.webhooks.constructEvent(body, signature, endpointSecret);
    return true;
  } catch (error) {
    console.error('Stripe signature validation failed:', error);
    return false;
  }
};

// Extract user ID from various possible sources in the session
const extractUserId = (session) => {
  // Option 1: From client_reference_id
  if (session.client_reference_id) {
    console.log('Found userId in client_reference_id:', session.client_reference_id);
    return session.client_reference_id;
  }
  
  // Option 2: From URL parameters
  if (session.success_url && session.success_url.includes('client_reference_id=')) {
    const urlParams = new URL(session.success_url).searchParams;
    const userId = urlParams.get('client_reference_id');
    if (userId) {
      console.log('Found userId in success_url params:', userId);
      return userId;
    }
  }
  
  // Option 3: From custom metadata
  if (session.metadata && session.metadata.userId) {
    console.log('Found userId in metadata:', session.metadata.userId);
    return session.metadata.userId;
  }
  
  // Option 4: Look up by customer email (handled separately)
  return null;
};

// Handle checkout session completed event
const handleCheckoutSession = async (session, supabase) => {
  let userId = extractUserId(session);
  
  // Option 4: Look up by customer email
  if (!userId && session.customer_email) {
    console.log('Looking up user by email:', session.customer_email);
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', session.customer_email)
      .single();
      
    if (!userError && userData) {
      userId = userData.id;
      console.log('Found user by email:', userId);
    }
  }
  
  console.log('checkout.session.completed event received:', {
    session_id: session.id,
    payment_status: session.payment_status,
    userId: userId || 'not found'
  });
  
  if (userId) {
    console.log('Updating profile for user:', userId);
    const { error } = await supabase
      .from('profiles')
      .update({ has_paid: true })
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      throw new Error(`Failed to update user profile: ${error.message}`);
    }
    
    console.log(`Webhook: Payment completed and profile updated for user: ${userId}`);
  } else {
    console.error('No user ID found in session. Full session data:', JSON.stringify(session, null, 2));
  }
};

// Handle payment intent succeeded event
const handlePaymentIntent = async (paymentIntent, supabase) => {
  const metadata = paymentIntent.metadata || {};
  const userId = metadata.userId;
  
  console.log('payment_intent.succeeded event received:', {
    payment_intent_id: paymentIntent.id,
    amount: paymentIntent.amount,
    userId: userId || 'not found'
  });
  
  if (userId) {
    console.log('Updating profile for user from payment intent:', userId);
    const { error } = await supabase
      .from('profiles')
      .update({ has_paid: true })
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile from payment intent:', error);
    } else {
      console.log(`Payment intent succeeded and profile updated for user: ${userId}`);
    }
  } else {
    console.log('No user ID found in payment intent metadata');
  }
};

Deno.serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const origin = req.headers.get('origin');
  const isValidOrigin = origin ? true : false; // In production, restrict to specific origins

  if (!isValidOrigin) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized origin' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 403,
      }
    );
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    console.error('No Stripe signature provided in webhook request');
    return new Response(
      JSON.stringify({ error: 'Webhook Error: No signature provided' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }

  try {
    const body = await req.text();
    console.log('Received webhook request');
    
    // Get the Stripe API key from environment variables
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error("Stripe API key not configured");
    }
    
    // Verify the webhook signature
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
    
    if (!validateStripeSignature(signature, body, endpointSecret, stripeKey)) {
      return new Response(
        JSON.stringify({ error: 'Invalid Stripe signature' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }
    
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    console.log('Webhook event type:', event.type);

    // Initialize the Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle specific webhook events
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutSession(event.data.object, supabase);
    } else if (event.type === 'payment_intent.succeeded') {
      await handlePaymentIntent(event.data.object, supabase);
    } else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      console.log('Subscription cancelled:', subscription.id);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return new Response(
      JSON.stringify({ error: `Webhook Error: ${error.message}` }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
