
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
  // Option 1: From client_reference_id
  if (session.client_reference_id) {
    return session.client_reference_id;
  }
  
  // Option 2: From URL parameters
  if (session.success_url && session.success_url.includes('client_reference_id=')) {
    const urlParams = new URL(session.success_url).searchParams;
    const userId = urlParams.get('client_reference_id');
    if (userId) return userId;
  }
  
  // Option 3: From custom metadata
  if (session.metadata && session.metadata.userId) {
    return session.metadata.userId;
  }
  
  return null;
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
      JSON.stringify({ error: 'Webhook Error: No signature provided' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }

  try {
    const body = await req.text();
    
    // Get the Stripe API key from environment variables
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error("Stripe API key not configured");
    }
    
    // Verify the webhook signature
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    
    try {
      const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
      
      // Initialize the Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration missing');
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey);
  
      // Handle specific webhook events
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = extractUserId(session);
        
        if (!userId) {
          console.error('No user ID found in session. Full session data:', JSON.stringify(session, null, 2));
          throw new Error('User ID not found in session data');
        }
        
        // Update user profile
        const { error } = await supabase
          .from('profiles')
          .update({ has_paid: true })
          .eq('id', userId);
      
        if (error) {
          console.error('Error updating profile:', error);
          throw new Error(`Failed to update user profile: ${error.message}`);
        }
        
        console.log(`Webhook: Payment completed and profile updated for user: ${userId}`);
      } else if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata?.userId;
        
        if (userId) {
          await supabase
            .from('profiles')
            .update({ has_paid: true })
            .eq('id', userId);
            
          console.log(`Payment intent succeeded and profile updated for user: ${userId}`);
        }
      }
  
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (verificationError) {
      console.error('Stripe signature validation failed:', verificationError);
      return new Response(
        JSON.stringify({ error: 'Invalid Stripe signature' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }
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
