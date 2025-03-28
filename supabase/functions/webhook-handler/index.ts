
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import Stripe from 'https://esm.sh/stripe@12.14.0';

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Extract user ID from various possible sources in the session
const extractUserId = (session) => {
  if (session.client_reference_id) return session.client_reference_id;
  
  if (session.success_url && session.success_url.includes('client_reference_id=')) {
    return new URL(session.success_url).searchParams.get('client_reference_id');
  }
  
  return session.metadata?.userId || null;
};

Deno.serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify Stripe signature
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response(
      JSON.stringify({ error: 'No signature provided' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  try {
    const body = await req.text();
    
    // Get the Stripe API key and webhook secret
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
    
    if (!stripeKey) throw new Error("Stripe API key not configured");
    
    // Verify the webhook signature
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error('Signature validation failed:', err);
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle checkout session completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = extractUserId(session);
      
      if (!userId) {
        console.error('No user ID found in session');
        throw new Error('User ID not found');
      }
      
      // Update user profile
      const { error } = await supabase
        .from('profiles')
        .update({ has_paid: true })
        .eq('id', userId);
    
      if (error) {
        throw new Error(`Failed to update profile: ${error.message}`);
      }
      
      console.log(`Payment completed for user: ${userId}`);
    } 
    // Handle payment intent success
    else if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const userId = paymentIntent.metadata?.userId;
      
      if (userId) {
        await supabase
          .from('profiles')
          .update({ has_paid: true })
          .eq('id', userId);
          
        console.log(`Payment succeeded for user: ${userId}`);
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Webhook error:', error.message);
    return new Response(
      JSON.stringify({ error: `Webhook Error: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
