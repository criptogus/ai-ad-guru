
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

// CORS headers for the response
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Get the request body
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing user ID" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Initialize Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Check if user already claimed free credits
    const { data: userData, error: userError } = await supabaseAdmin
      .from("profiles")
      .select("id, received_free_credits")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Error fetching user data" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    if (!userData) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // If user has already claimed free credits, return an error
    if (userData.received_free_credits) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Free credits have already been claimed" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Add entry to credit ledger
    const { error: ledgerError } = await supabaseAdmin
      .from("credit_ledger")
      .insert({
        user_id: userId,
        change: 15,
        reason: "welcome_credits",
        ref_id: "free_credits_claim"
      });

    if (ledgerError) {
      console.error("Error adding credits to ledger:", ledgerError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Error adding credits to ledger" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Update user profile to mark free credits as claimed
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ received_free_credits: true })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating user profile:", updateError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Error updating user profile" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "15 free credits have been added to your account" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error claiming free credits:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
