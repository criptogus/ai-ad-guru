
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');

    if (!supabaseUrl || !supabaseKey || !stripeKey) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    // Get all campaigns with active ads
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('id, user_id, name, platform, budget, budget_type, status')
      .eq('status', 'active');

    if (campaignsError) {
      throw campaignsError;
    }

    console.log(`Processing ${campaigns?.length || 0} active campaigns`);

    const results = [];
    // Process each campaign to calculate and charge the 10% fee
    for (const campaign of campaigns || []) {
      try {
        // Get yesterday's spend for this campaign
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateStr = yesterday.toISOString().split('T')[0];

        const { data: performance, error: perfError } = await supabase
          .from('campaign_performance')
          .select('spend')
          .eq('campaign_id', campaign.id)
          .eq('date', dateStr)
          .maybeSingle();

        if (perfError) {
          console.error(`Error fetching performance for campaign ${campaign.id}:`, perfError);
          continue;
        }

        if (!performance || !performance.spend) {
          console.log(`No spend recorded for campaign ${campaign.id} on ${dateStr}`);
          continue;
        }

        // Calculate 10% fee on the spend amount
        const spendAmount = performance.spend;
        const feeAmount = Math.round(spendAmount * 10) / 100; // 10% of spend, ensuring 2 decimal places
        
        // Only charge if there was actual spend and it's more than $0.50
        if (feeAmount < 0.5) {
          console.log(`Fee amount too small for campaign ${campaign.id}: $${feeAmount}`);
          continue;
        }

        // Get user's Stripe customer ID
        const { data: user, error: userError } = await supabase
          .from('profiles')
          .select('stripe_customer_id')
          .eq('id', campaign.user_id)
          .single();

        if (userError || !user?.stripe_customer_id) {
          console.error(`Error fetching Stripe customer for user ${campaign.user_id}:`, userError);
          continue;
        }

        // Create a usage record for the ad spend fee
        const usageRecord = await stripe.subscriptionItems.createUsageRecord(
          user.stripe_customer_id, // assuming customer_id is used as subscription_item_id
          {
            quantity: Math.round(feeAmount * 100), // Convert to cents
            timestamp: 'now',
            action: 'increment',
          }
        );

        // Log the fee charge
        const { data: logEntry, error: logError } = await supabase
          .from('ad_spend_fees')
          .insert({
            user_id: campaign.user_id,
            campaign_id: campaign.id,
            spend_amount: spendAmount,
            fee_amount: feeAmount,
            date: dateStr,
            stripe_usage_record_id: usageRecord.id
          });

        if (logError) {
          console.error(`Error logging fee for campaign ${campaign.id}:`, logError);
          continue;
        }

        results.push({
          campaign_id: campaign.id,
          spend: spendAmount,
          fee: feeAmount,
          success: true
        });

        console.log(`Charged $${feeAmount} fee for $${spendAmount} spend on campaign ${campaign.id}`);
      } catch (error) {
        console.error(`Error processing campaign ${campaign.id}:`, error);
        results.push({
          campaign_id: campaign.id,
          error: error.message,
          success: false
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: campaigns?.length || 0,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error in report-ad-spend function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
