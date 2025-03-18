
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
  // Handle CORS preflight request
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

    // Retrieve the checkout session
    let session;
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
      throw new Error(`Could not retrieve session: ${stripeError.message}`);
    }

    // Initialize the Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the user ID from the session
    const userId = session.client_reference_id;
    if (!userId) {
      console.error('User ID not found in session metadata:', session);
      throw new Error('User ID not found in session');
    }

    console.log('User ID from session:', userId);

    // If payment was successful, update the user's subscription status
    // Consider both 'paid' status and 'complete' status as success indicators
    const paymentSuccessful = session.payment_status === 'paid' || session.status === 'complete';
    
    if (paymentSuccessful) {
      console.log('Payment verified as successful. Updating profile for user:', userId);
      
      try {
        // Update the user's profile to reflect payment
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ has_paid: true })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          throw new Error(`Failed to update user profile: ${updateError.message}`);
        }
        
        // Verify the update was successful
        const { data: updatedProfile, error: verifyError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (verifyError) {
          console.error('Error verifying profile update:', verifyError);
        } else {
          console.log('Profile updated successfully:', updatedProfile);
        }
      } catch (dbError) {
        console.error('Database operation error:', dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }
      
      console.log(`Payment verified and profile updated for user: ${userId}`);
    } else {
      console.log(`Payment not completed. Status: ${session.status}, Payment status: ${session.payment_status}`);
    }

    // Return the session status
    return new Response(
      JSON.stringify({ 
        verified: paymentSuccessful,
        session: {
          id: session.id,
          status: session.status,
          payment_status: session.payment_status,
          userId: userId
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
