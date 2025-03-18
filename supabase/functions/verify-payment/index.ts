
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
    const bodyText = await req.text();
    let body;
    
    try {
      body = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError, 'Raw body:', bodyText);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    const { sessionId, direct = false } = body;

    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    console.log('Verifying payment for session:', sessionId, 'Direct mode:', direct);

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
      
      // If we're in direct mode and this is a test session, return mock data for debugging
      if (direct && sessionId.startsWith('cs_test_')) {
        console.log('Direct mode with test session ID, returning mock success');
        return new Response(
          JSON.stringify({ 
            verified: true,
            debug: true,
            mock: true,
            session: {
              id: sessionId,
              status: 'complete',
              payment_status: 'paid',
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }
      
      // Try retrieving the session again with expanded properties
      try {
        console.log('Attempting to retrieve session with expanded properties');
        session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ['customer', 'payment_intent', 'subscription']
        });
        console.log('Session retrieved with expanded properties');
      } catch (expandedError) {
        console.error('Error retrieving expanded session:', expandedError);
        throw new Error(`Could not retrieve session: ${stripeError.message}`);
      }
    }

    // Initialize the Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract user ID from multiple possible sources
    let userId = null;
      
    // Option 1: From client_reference_id
    if (session.client_reference_id) {
      userId = session.client_reference_id;
      console.log('Found userId in client_reference_id:', userId);
    }
    
    // Option 2: From custom metadata
    else if (session.metadata && session.metadata.userId) {
      userId = session.metadata.userId;
      console.log('Found userId in metadata:', userId);
    }
    
    // Option 3: From URL query parameters
    else if (session.success_url && session.success_url.includes('client_reference_id=')) {
      const url = new URL(session.success_url);
      const params = new URLSearchParams(url.search);
      userId = params.get('client_reference_id');
      console.log('Found userId in success_url params:', userId);
    }
    
    // Option 4: Look up by customer email
    else if (session.customer_email) {
      console.log('Looking up user by email:', session.customer_email);
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

    if (!userId) {
      console.error('User ID not found in session:', session);
      
      // For debugging in direct mode, create a mock success
      if (direct) {
        console.log('Direct mode, returning mock success despite missing user ID');
        return new Response(
          JSON.stringify({ 
            verified: true,
            debug: true,
            mock: true,
            warning: 'No user ID found',
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
      }
      
      throw new Error('Unable to determine user from payment session');
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
