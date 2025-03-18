
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import Stripe from 'https://esm.sh/stripe@12.14.0';

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Handle preflight OPTIONS request
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    console.error('No Stripe signature provided in webhook request');
    return new Response(
      JSON.stringify({ error: 'Webhook Error: No signature provided' }),
      {
        headers: { 'Content-Type': 'application/json' },
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
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });
    
    // Verify the webhook signature
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
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
      const session = event.data.object;
      const userId = session.client_reference_id;
      
      console.log('checkout.session.completed event received:', {
        session_id: session.id,
        payment_status: session.payment_status,
        userId
      });
      
      if (userId) {
        console.log('Updating profile for user:', userId);
        // Update the user's profile to reflect payment
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
        console.error('No user ID found in session:', session);
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      // Handle subscription cancellation
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
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
