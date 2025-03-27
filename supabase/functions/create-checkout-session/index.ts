
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
  // Handle CORS preflight requests
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
    const { userId, planId, returnUrl } = requestBody;

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
    console.log('Plan ID:', planId || 'default plan');
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
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Set up product details based on plan ID or use default
    let productDetails;
    let priceAmount;
    let creditAmount;

    // Define credit packages
    switch (planId) {
      case 'starter':
        productDetails = {
          name: 'Starter Credit Pack',
          description: '100 credits for AI-generated ads and optimization',
        };
        priceAmount = 4900; // $49.00
        creditAmount = 100;
        break;
      case 'pro':
        productDetails = {
          name: 'Professional Credit Pack',
          description: '250 credits for AI-generated ads and optimization',
        };
        priceAmount = 9900; // $99.00
        creditAmount = 250;
        break;
      case 'agency':
        productDetails = {
          name: 'Agency Credit Pack',
          description: '700 credits for AI-generated ads and optimization',
        };
        priceAmount = 24900; // $249.00
        creditAmount = 700;
        break;
      case 'subscription':
        productDetails = {
          name: 'AI AdGuru Pro Subscription',
          description: '400 credits per month, AI-generated ad copy and images, campaign management',
        };
        priceAmount = 9900; // $99.00
        creditAmount = 400;
        break;
      default:
        productDetails = {
          name: 'Custom Credit Pack',
          description: 'Credits for AI-generated ads and optimization',
        };
        priceAmount = 4900; // Default to $49.00
        creditAmount = 100;
    }

    // Set up metadata for the checkout session
    const metadata = {
      userId: userId,
      planId: planId || 'default',
      creditAmount: creditAmount.toString(),
      createdAt: new Date().toISOString(),
    };

    // Create a checkout session with detailed product information
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
      allow_promotion_codes: true,
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: returnUrl,
      metadata: metadata,
      client_reference_id: userId,
    });

    // Log success for debugging
    console.log('Checkout session created:', session.id);
    
    // Return the session ID and URL
    return new Response(
      JSON.stringify({ 
        sessionId: session.id, 
        url: session.url,
        creditAmount: creditAmount,
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
        error: error.message || "An unexpected error occurred"
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
