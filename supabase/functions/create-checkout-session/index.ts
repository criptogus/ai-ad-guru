
// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { userId, planId, returnUrl } = await req.json();
    
    console.log(`Creating checkout session for user ${userId}, plan ${planId}`);

    // Very simplified mock response
    return new Response(
      JSON.stringify({ 
        success: true,
        url: returnUrl || `https://example.com/checkout-success?session=mock-${Date.now()}`,
        sessionId: `mock-session-${Date.now()}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    
    // Simplified error response
    return new Response(
      JSON.stringify({ error: "Checkout creation failed" }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
