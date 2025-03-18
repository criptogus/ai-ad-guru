
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

  try {
    // Get the session ID from the request body
    const { sessionId } = await req.json();

    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    console.log('Verifying payment for session:', sessionId);

    // Get the Stripe API key from environment variables
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error("Stripe API key not configured");
    }

    // Initialize Stripe with the secret key
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Retrieve the session to verify payment status
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Session status:', session.status);
    console.log('Payment status:', session.payment_status);

    // Initialize the Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // If payment was successful, update the user's subscription status
    if (session.payment_status === 'paid' || session.status === 'complete') {
      const userId = session.client_reference_id || session.metadata?.userId;
      
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
        
        console.log(`Payment verified and profile updated for user: ${userId}`);
      } else {
        throw new Error('User ID not found in session metadata');
      }
    }

    // Return the session status
    return new Response(
      JSON.stringify({ 
        verified: session.payment_status === 'paid' || session.status === 'complete',
        session: {
          id: session.id,
          status: session.status,
          payment_status: session.payment_status
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    // Log the error
    console.error('Error verifying payment:', error);
    
    // Return an error response
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
