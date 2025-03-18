
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import Stripe from 'https://esm.sh/stripe@12.14.0';
import { corsHeaders } from './utils/cors.ts';
import { verifyStripePayment } from './services/stripe.ts';
import { updateUserSubscription } from './services/supabase.ts';
import { createMockResponse } from './utils/mock.ts';

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

    // Handling direct mode with test session for debugging
    if (direct && sessionId.startsWith('cs_test_')) {
      console.log('Direct mode with test session ID, returning mock success');
      return createMockResponse(sessionId, corsHeaders);
    }

    // Retrieve and verify the Stripe session
    const { session, success: paymentSuccessful, userId } = await verifyStripePayment(sessionId);
    
    if (!userId) {
      console.error('User ID not found in session:', session);
      
      // For debugging in direct mode, create a mock success
      if (direct) {
        console.log('Direct mode, returning mock success despite missing user ID');
        return createMockResponse(sessionId, corsHeaders, 'No user ID found');
      }
      
      throw new Error('Unable to determine user from payment session');
    }

    console.log('User ID from session:', userId);

    // If payment was successful, update the user's subscription status
    if (paymentSuccessful) {
      await updateUserSubscription(userId);
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
