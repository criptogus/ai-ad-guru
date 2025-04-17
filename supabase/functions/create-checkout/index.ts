
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CREDIT_PACKS = {
  'basic': { credits: 100, price: 1500 },
  'pro': { credits: 250, price: 3500 },
  'enterprise': { credits: 500, price: 6500 },
  'subscription': { credits: 100, price: 1275 } // 15% discount
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { packId, isSubscription = false, userId, returnUrl } = await req.json();
    
    if (!packId || !userId) {
      throw new Error('Missing required parameters');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const pack = CREDIT_PACKS[packId];
    if (!pack) {
      throw new Error('Invalid pack selected');
    }

    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${pack.credits} Credits${isSubscription ? ' Monthly' : ''}`,
            description: `${pack.credits} credits for AI-powered ad creation${isSubscription ? ' (Monthly subscription)' : ''}`,
          },
          unit_amount: pack.price,
          recurring: isSubscription ? { interval: 'month' } : undefined,
        },
        quantity: 1,
      }],
      success_url: `${returnUrl || req.headers.get('origin')}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl || req.headers.get('origin')}/billing?canceled=true`,
      client_reference_id: userId,
      metadata: {
        credits: pack.credits.toString(),
        userId,
        packId
      }
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
