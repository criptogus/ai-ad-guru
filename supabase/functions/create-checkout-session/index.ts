
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import Stripe from 'https://esm.sh/stripe@12.14.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestBody = await req.json();
    const { userId, planId, returnUrl } = requestBody;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!planId) {
      return new Response(
        JSON.stringify({ error: "Plan ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: "Supabase configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user information
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Stripe with secret key
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: "Stripe configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Set up credit plans
    const creditPlans = {
      starter: { amount: 100, price: 1500 },  // $15 for 100 credits
      pro: { amount: 500, price: 5000 },      // $50 for 500 credits
      agency: { amount: 2000, price: 15000 }, // $150 for 2000 credits
    };

    const selectedPlan = creditPlans[planId as keyof typeof creditPlans];
    
    if (!selectedPlan) {
      return new Response(
        JSON.stringify({ error: "Invalid plan ID" }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${selectedPlan.amount} Credits`,
              description: `Purchase ${selectedPlan.amount} credits for AI Ad Manager`,
            },
            unit_amount: selectedPlan.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: returnUrl || `${req.headers.get('origin')}/billing?success=true`,
      cancel_url: `${req.headers.get('origin')}/billing?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId: userId,
        creditAmount: selectedPlan.amount.toString(),
      },
    });

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
