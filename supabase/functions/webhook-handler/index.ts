
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
      
      // Try to get user ID from client_reference_id
      let userId = session.client_reference_id;
      
      // If userId is not available in client_reference_id, try to get it from metadata
      if (!userId && session.metadata && session.metadata.userId) {
        userId = session.metadata.userId;
      }
      
      // If userId is still not available, try to get user from customer email
      if (!userId && session.customer_email) {
        console.log('Looking up user by email:', session.customer_email);
        // Look up user by email
        const { data: userData, error: userError } = await supabase
          .from('auth.users')
          .select('id')
          .eq('email', session.customer_email)
          .single();
          
        if (userError) {
          console.error('Error looking up user by email:', userError);
        } else if (userData) {
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
    } else if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata || {};
      const userId = metadata.userId;
      
      console.log('payment_intent.succeeded event received:', {
        payment_intent_id: paymentIntent.id,
        amount: paymentIntent.amount,
        userId: userId || 'not found'
      });
      
      if (userId) {
        console.log('Updating profile for user from payment intent:', userId);
        // Update the user's profile to reflect payment
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
