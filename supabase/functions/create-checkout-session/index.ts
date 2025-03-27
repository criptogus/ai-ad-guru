
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import Stripe from 'https://esm.sh/stripe@12.14.0';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { userId, planId, returnUrl } = await req.json();

    if (!userId || !returnUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Get Stripe API key
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: "Stripe API key not configured" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Set up product details based on plan ID
    let productDetails;
    let priceAmount;
    let creditAmount;

    // Define credit packages with simplified structure
    switch (planId) {
      case 'starter':
        productDetails = { name: 'Starter Credit Pack', description: '100 credits' };
        priceAmount = 1500; // $15.00
        creditAmount = 100;
        break;
      case 'pro':
        productDetails = { name: 'Professional Credit Pack', description: '500 credits' };
        priceAmount = 5000; // $50.00
        creditAmount = 500;
        break;
      case 'agency':
        productDetails = { name: 'Agency Credit Pack', description: '2000 credits' };
        priceAmount = 15000; // $150.00
        creditAmount = 2000;
        break;
      case 'subscription':
        productDetails = { name: 'AI AdGuru Pro Subscription', description: '400 credits/month' };
        priceAmount = 9900; // $99.00
        creditAmount = 400;
        break;
      default:
        productDetails = { name: 'Custom Credit Pack', description: 'Credits for ads' };
        priceAmount = 1500; // Default to $15.00
        creditAmount = 100;
    }

    // Set up metadata
    const metadata = {
      userId,
      planId: planId || 'default',
      creditAmount: creditAmount.toString()
    };

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productDetails.name,
              description: productDetails.description,
            },
            unit_amount: priceAmount,
            ...(planId === 'subscription' ? {
              recurring: {
                interval: 'month',
              },
            } : {}),
          },
          quantity: 1,
        },
      ],
      mode: planId === 'subscription' ? 'subscription' : 'payment',
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: returnUrl,
      metadata,
      client_reference_id: userId,
    });
    
    // Return the session
    return new Response(
      JSON.stringify({ 
        sessionId: session.id, 
        url: session.url,
        creditAmount,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    // Return error response
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
