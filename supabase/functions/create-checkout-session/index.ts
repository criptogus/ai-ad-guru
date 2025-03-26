
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
    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Validate required fields
    const { userId, returnUrl } = requestBody;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (!returnUrl) {
      return new Response(
        JSON.stringify({ error: "Return URL is required" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    console.log('Creating checkout session for user:', userId);
    console.log('Return URL:', returnUrl);

    // Get the Stripe API key from environment variables
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return new Response(
        JSON.stringify({ error: "Stripe API key not configured" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Initialize Stripe with the secret key
    let stripe;
    try {
      stripe = new Stripe(stripeKey, {
        apiVersion: '2023-10-16',
      });
    } catch (stripeInitError) {
      console.error('Error initializing Stripe:', stripeInitError);
      return new Response(
        JSON.stringify({ error: "Error initializing payment system" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Set up metadata for the checkout session
    const metadata = {
      userId: userId,
      createdAt: new Date().toISOString(),
    };

    // Create a checkout session with detailed product information
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'AI AdGuru Pro Subscription',
                description: '400 credits per month, AI-generated ad copy and images, campaign management',
                images: ['https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=2070&auto=format&fit=crop'],
              },
              unit_amount: 9900, // $99.00
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        customer_email: null, // Could be dynamically set if we have user email
        success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: returnUrl,
        metadata: metadata,
        client_reference_id: userId, // Important for identifying the user
      });
    } catch (sessionError) {
      console.error('Error creating Stripe checkout session:', sessionError);
      return new Response(
        JSON.stringify({ 
          error: sessionError.message || "Error creating checkout session",
          details: process.env.NODE_ENV !== 'production' ? sessionError : undefined
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Log success for debugging
    console.log('Checkout session created:', session.id);
    
    // Return the session ID and URL
    return new Response(
      JSON.stringify({ 
        sessionId: session.id, 
        url: session.url,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    // Log the error
    console.error('Error creating checkout session:', error);
    
    // Return an error response
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unexpected error occurred",
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
