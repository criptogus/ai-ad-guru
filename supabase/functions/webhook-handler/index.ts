
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import Stripe from 'https://esm.sh/stripe@12.14.0';

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // In production, limit this to specific domains
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Security utility to validate request origin
const isValidOrigin = (req: Request): boolean => {
  const origin = req.headers.get('origin');
  // In production, restrict to specific origins
  // return origin === 'https://yourdomain.com' || origin === 'https://app.yourdomain.com';
  return true; // For development; restrict this in production
};

// Validate Stripe signature
const validateStripeSignature = (signature: string | null, body: string, endpointSecret: string): boolean => {
  if (!signature) return false;
  
  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) return false;
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });
    
    // This will throw if validation fails
    stripe.webhooks.constructEvent(body, signature, endpointSecret);
    return true;
  } catch (error) {
    console.error('Stripe signature validation failed:', error);
    return false;
  }
};

// Handle preflight OPTIONS request
Deno.serve(async (req) => {
  // Rate limiting could be implemented here using a counter in database or Redis
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate request origin for enhanced security
  if (!isValidOrigin(req)) {
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
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });
    
    // Verify the webhook signature
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
    
    // Enhanced signature validation
    if (!validateStripeSignature(signature, body, endpointSecret)) {
      return new Response(
        JSON.stringify({ error: 'Invalid Stripe signature' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }
    
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
      
      // Try to extract user ID from multiple possible sources
      let userId = null;
      
      // Option 1: From client_reference_id
      if (session.client_reference_id) {
        userId = session.client_reference_id;
        console.log('Found userId in client_reference_id:', userId);
      }
      
      // Option 2: From URL parameters (which we set in the success_url)
      else if (session.success_url && session.success_url.includes('client_reference_id=')) {
        const urlParams = new URL(session.success_url).searchParams;
        userId = urlParams.get('client_reference_id');
        console.log('Found userId in success_url params:', userId);
      }
      
      // Option 3: From custom metadata
      else if (session.metadata && session.metadata.userId) {
        userId = session.metadata.userId;
        console.log('Found userId in metadata:', userId);
      }
      
      // Option 4: Look up by customer email
      else if (session.customer_email) {
        console.log('Looking up user by email:', session.customer_email);
        // Look up user by email
        const { data: userData, error: userError } = await supabase
          .from('profiles')
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
      
      // Option 5: Try to extract from URL params in session.id
      else if (session.id && session.id.includes('client_reference_id=')) {
        const matches = session.id.match(/client_reference_id=([^&]+)/);
        if (matches && matches[1]) {
          userId = matches[1];
          console.log('Extracted userId from session.id:', userId);
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
        console.error('No user ID found in session. Full session data:', JSON.stringify(session, null, 2));
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
