
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import Stripe from 'https://esm.sh/stripe@12.14.0';

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Extract user ID from session with fallbacks
const extractUserId = (session) => 
  session?.client_reference_id || 
  (session?.success_url && new URL(session.success_url).searchParams.get('client_reference_id')) || 
  session?.metadata?.userId || 
  null;

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
    
    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    
    // Verify webhook signature
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

    // Handle payment events
    if (event.type === 'checkout.session.completed' || 
        (event.type === 'payment_intent.succeeded' && event.data.object.metadata?.userId)) {
      
      const userId = event.type === 'checkout.session.completed' 
        ? extractUserId(event.data.object)
        : event.data.object.metadata?.userId;
      
      if (userId) {
        const { error } = await supabase
          .from('profiles')
          .update({ has_paid: true })
          .eq('id', userId);
      
        if (error) {
          console.error(`Failed to update profile: ${error.message}`);
        } else {
          console.log(`Payment completed for user: ${userId}`);
        }
      } else {
        console.error('No user ID found in event data');
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
