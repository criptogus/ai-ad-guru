
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize Supabase client with admin rights
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get the user profile to check has_paid flag
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('has_paid, email')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user profile', details: profileError?.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // If profile has paid flag is true, no need to check with Stripe
    if (profile.has_paid) {
      console.log(`User ${userId} has paid according to profile.`);
      return new Response(
        JSON.stringify({ active: true, source: 'supabase_profile' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For more reliable verification, check with Stripe directly
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Get Stripe customer by email
    const email = profile.email;
    const customers = await stripe.customers.list({ email, limit: 1 });
    
    if (customers.data.length === 0) {
      console.log(`No Stripe customer found for user ${userId} with email ${email}`);
      return new Response(
        JSON.stringify({ active: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for active subscriptions
    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    const hasActiveSubscription = subscriptions.data.length > 0;
    
    console.log(`User ${userId} subscription status: ${hasActiveSubscription ? 'active' : 'inactive'}`);

    // If user has active subscription in Stripe but not in our DB, update the DB
    if (hasActiveSubscription && !profile.has_paid) {
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ has_paid: true })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating profile with subscription status:', updateError);
      } else {
        console.log(`Updated profile for user ${userId} with active subscription status`);
      }
    }

    return new Response(
      JSON.stringify({ 
        active: hasActiveSubscription,
        source: 'stripe_verification'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-subscription function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
