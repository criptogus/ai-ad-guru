
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
      // If the field doesn't exist yet, check if the profile exists
      console.error("Error fetching user data:", userError);
      
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();
        
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "User profile not found" 
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404,
          }
        );
      }
    }

    // If user has already claimed free credits, return an error
    if (userData?.received_free_credits) {
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

    console.log("Attempting to add free credits for user:", userId);

    // Direct update to profiles table
    const { error: updateCreditsError } = await supabaseAdmin
      .rpc('add_user_credits', {
        user_id: userId,
        amount: 15
      });
    
    if (updateCreditsError) {
      console.error("Error adding credits via RPC:", updateCreditsError);
      
      // Fallback: Try direct update
      const { data: currentProfile, error: fetchError } = await supabaseAdmin
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();
        
      if (fetchError) {
        console.error("Error fetching current credits:", fetchError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "Error fetching user credits" 
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
      
      const currentCredits = currentProfile?.credits || 0;
      
      // Update user credits directly
      const { error: directUpdateError } = await supabaseAdmin
        .from("profiles")
        .update({ 
          credits: currentCredits + 15,
          received_free_credits: true
        })
        .eq("id", userId);
        
      if (directUpdateError) {
        console.error("Error updating user credits directly:", directUpdateError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "Error updating user credits" 
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
      
      // Try to add credit ledger entry, but don't fail if it doesn't work
      await supabaseAdmin
        .from("credit_ledger")
        .insert({
          user_id: userId,
          change: 15,
          reason: "welcome_credits",
          ref_id: "free_credits_claim"
        })
        .then(res => {
          if (res.error) {
            console.warn("Could not add to credit ledger, but credits were added:", res.error);
          }
        });
    } else {
      // Update received_free_credits flag
      const { error: updateFlagError } = await supabaseAdmin
        .from("profiles")
        .update({ received_free_credits: true })
        .eq("id", userId);

      if (updateFlagError) {
        console.error("Error updating free credits flag:", updateFlagError);
        console.warn("Credits were added but flag was not updated");
      }
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
