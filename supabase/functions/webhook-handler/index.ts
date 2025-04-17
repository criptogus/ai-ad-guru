import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extract user ID from session with fallbacks
const extractUserId = (session) => 
  session?.client_reference_id || 
  (session?.success_url && new URL(session.success_url).searchParams.get('client_reference_id')) || 
  session?.metadata?.userId || 
  null;

serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify Stripe signature
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    console.log('No signature provided');
    return new Response(
      JSON.stringify({ error: 'No signature provided' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  try {
    const body = await req.text();
    console.log('Webhook received with signature');
    
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
      console.log('Event constructed:', event.type);
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

    // Handle subscription events
    if (event.type === 'customer.subscription.created' ||
        event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      
      // Find customer email
      const customer = await stripe.customers.retrieve(subscription.customer);
      const customerEmail = customer.email;
      
      if (!customerEmail) {
        console.error('No customer email found for subscription');
        return new Response(
          JSON.stringify({ error: 'No customer email found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
      
      // Find user by email
      const { data: users, error: userError } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', customerEmail)
        .limit(1);
      
      if (userError || !users || users.length === 0) {
        console.error('User not found for email:', customerEmail);
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }
      
      const userId = users[0].id;
      const isActive = subscription.status === 'active' || 
                      subscription.status === 'trialing';
      
      // Update user profile
      const { error } = await supabase
        .from('profiles')
        .update({ has_paid: isActive })
        .eq('id', userId);
      
      if (error) {
        console.error(`Failed to update profile: ${error.message}`);
      } else {
        console.log(`Updated subscription status for user: ${userId} to ${isActive}`);
      }
    }

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

    // Handle checkout session completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id;
      const credits = parseInt(session.metadata?.credits || '0');

      if (userId && credits > 0) {
        // Add credits to the ledger
        const { error: creditError } = await supabase
          .from('credit_ledger')
          .insert({
            user_id: userId,
            change: credits,
            reason: 'purchase',
            ref_id: session.id
          });

        if (creditError) {
          console.error('Error adding credits:', creditError);
          throw creditError;
        }

        console.log(`Added ${credits} credits for user ${userId}`);
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
