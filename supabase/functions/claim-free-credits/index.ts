
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

// CORS headers for the response
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Debug helper
const log = (message: string, data?: any) => {
  if (data) {
    console.log(`[CLAIM-FREE-CREDITS] ${message}:`, data);
  } else {
    console.log(`[CLAIM-FREE-CREDITS] ${message}`);
  }
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    log("Function started");
    
    // Get the request body
    const body = await req.json();
    const { userId } = body;

    log("Request body", { userId });

    if (!userId) {
      log("Missing user ID");
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

    log("Checking if user has claimed free credits");
    
    // First check if the user has already claimed free credits
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, credits, received_free_credits")
      .eq("id", userId)
      .single();

    if (profileError) {
      log("Error fetching profile", profileError);
      
      // Check if error is due to missing column
      if (profileError.message.includes("column profiles.received_free_credits does not exist")) {
        log("'received_free_credits' column doesn't exist - adding it");
        
        // First check if user already has credits from a previous operation
        const { data: userData } = await supabaseAdmin
          .from("profiles")
          .select("id, credits")
          .eq("id", userId)
          .single();
        
        // If we got user data despite error, proceed with adding column and update
        if (userData) {
          log("User found, updating profile with received_free_credits column", userData);
          
          // Update the profile with received_free_credits column
          const { error: alterError } = await supabaseAdmin.rpc('add_column_if_not_exists', {
            table_name: 'profiles',
            column_name: 'received_free_credits',
            column_type: 'boolean'
          });
          
          if (alterError) {
            log("Error adding column", alterError);
            throw new Error(`Failed to add received_free_credits column: ${alterError.message}`);
          }
          
          // Continue with the credit update after adding the column
          const currentCredits = userData.credits || 0;
          
          log("Updating user with free credits", { 
            userId,
            currentCredits, 
            newCredits: currentCredits + 15 
          });
          
          const { error: updateError } = await supabaseAdmin
            .from("profiles")
            .update({ 
              credits: currentCredits + 15,
              received_free_credits: true
            })
            .eq("id", userId);
            
          if (updateError) {
            log("Error updating profile with credits", updateError);
            throw new Error(`Failed to update user credits: ${updateError.message}`);
          }
          
          // Add to credit_ledger
          await addCreditLedgerEntry(supabaseAdmin, userId);
          
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
        } else {
          // If no user found, return error
          throw new Error("User profile not found");
        }
      } else {
        // For other errors besides missing column
        throw new Error(`Failed to fetch user profile: ${profileError.message}`);
      }
    }

    // If user has already claimed free credits, return an error
    if (profileData?.received_free_credits) {
      log("Free credits already claimed", { profileData });
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

    log("Adding free credits for user", { userId, currentCredits: profileData?.credits });

    // 1. Update the user's profile with the additional credits
    const currentCredits = profileData?.credits || 0;
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ 
        credits: currentCredits + 15,
        received_free_credits: true
      })
      .eq("id", userId);

    if (updateError) {
      log("Error updating user profile", updateError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Failed to update user credits",
          error: updateError.message
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // 2. Add an entry to the credit_ledger table
    await addCreditLedgerEntry(supabaseAdmin, userId);

    // Success response
    log("Successfully added free credits");
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
    log("Error claiming free credits", error);
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

// Helper function to add credit ledger entry
async function addCreditLedgerEntry(supabase, userId) {
  try {
    const { error: ledgerError } = await supabase
      .from("credit_ledger")
      .insert({
        user_id: userId,
        change: 15,
        reason: "welcome_credits",
        ref_id: "free_credits_claim"
      });

    if (ledgerError) {
      console.warn("Could not add to credit ledger, but credits were added:", ledgerError);
      // Continue execution even if ledger entry fails - the credits were already added
    }
    return true;
  } catch (error) {
    console.error("Error adding ledger entry:", error);
    return false;
  }
}

// Helper function to add column if it doesn't exist
// Note: This will be called via RPC function that needs to exist in the database
