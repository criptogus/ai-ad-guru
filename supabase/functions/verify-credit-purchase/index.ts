
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

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
    // Parse the request body
    const body = await req.json();
    const { userId, timestamp, amount, price, stripeLink } = body;
    
    console.log('Verifying credit purchase:', { userId, timestamp, amount, price, stripeLink });
    
    // Validate the required fields
    if (!userId || !timestamp || !amount || !price || !stripeLink) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields', 
          verified: false 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
    
    // In a production environment, we would verify the purchase with Stripe's API
    // For now, we'll simulate a check based on the timestamp
    const purchaseTime = new Date(timestamp);
    const currentTime = new Date();
    const timeDifferenceMinutes = (currentTime.getTime() - purchaseTime.getTime()) / 1000 / 60;
    
    // Allow purchases made within the last 10 minutes
    // This is a simple validation; in a real-world scenario, you'd use Stripe's API
    if (timeDifferenceMinutes <= 10) {
      console.log('Credit purchase verified successfully');
      
      return new Response(
        JSON.stringify({ 
          verified: true,
          message: 'Purchase verified successfully' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    } else {
      console.log('Credit purchase verification failed: Purchase too old');
      
      return new Response(
        JSON.stringify({ 
          verified: false,
          message: 'Purchase verification failed. The purchase attempt is too old.' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ 
        error: `Server error: ${error.message}`,
        verified: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
