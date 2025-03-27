
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

    // Get the Stripe session ID from the request
    const { sessionId } = requestBody;

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "Session ID is required" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    console.log('Verifying payment session:', sessionId);

    // Get the Supabase client - we'll use this to update the user's credits
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the Stripe API key and initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return new Response(
        JSON.stringify({ error: "Payment system not properly configured" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Invalid session ID" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    // Check if the payment was successful
    if (session.payment_status !== 'paid') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Payment has not been completed",
          paymentStatus: session.payment_status
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    // Get the metadata from the session (user ID and credit amount)
    const userId = session.metadata?.userId || session.client_reference_id;
    const creditAmount = parseInt(session.metadata?.creditAmount || '100', 10);
    
    if (!userId) {
      console.error('No user ID found in session metadata');
      return new Response(
        JSON.stringify({ error: "Could not identify user for this session" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    console.log(`Adding ${creditAmount} credits to user ${userId}`);
    
    // Get the user's current credits
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
      
    if (userError) {
      console.error('Error fetching user profile:', userError);
      return new Response(
        JSON.stringify({ error: "Could not fetch user profile" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
    
    // Calculate new credit balance
    const currentCredits = userData.credits || 0;
    const newCreditBalance = currentCredits + creditAmount;
    
    // Update the user's credits
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        credits: newCreditBalance,
        has_paid: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (updateError) {
      console.error('Error updating user credits:', updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update user credits" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
    
    // Store the transaction in a credit_transactions table or similar
    // This would be implemented in a real app, but we'll skip it for this example
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        userId,
        creditAmount,
        newBalance: newCreditBalance,
        message: `Successfully added ${creditAmount} credits to user account`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error verifying payment:', error);
    
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
