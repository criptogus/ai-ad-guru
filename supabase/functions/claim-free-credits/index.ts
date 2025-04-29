
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
    // Parse request body
    const requestBody = await req.json();
    const { userId, creditsToAdd = 15 } = requestBody;

    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User ID is required',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    console.log(`Processing free credits claim for user: ${userId}`);
    
    // Get the Supabase client using the environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Server configuration error',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // First, check if the user has already claimed free credits
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('credits, received_free_credits')
      .eq('id', userId)
      .single();
    
    if (userError) {
      // Check if the error is because the column doesn't exist
      if (userError.message.includes('column "received_free_credits" does not exist')) {
        console.log('The received_free_credits column does not exist yet. Adding it.');
        
        // Attempt to add the column
        const addColumnResult = await supabase.rpc('add_column_if_not_exists', {
          table_name: 'profiles',
          column_name: 'received_free_credits',
          column_type: 'boolean'
        });
        
        if (addColumnResult.error) {
          console.error('Error adding column:', addColumnResult.error);
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Database schema error',
              details: addColumnResult.error.message,
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500,
            }
          );
        }
        
        // Now try to get the user data again, but only select credits this time
        const { data: retryData, error: retryError } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', userId)
          .single();
        
        if (retryError) {
          console.error('Error fetching user profile after column addition:', retryError);
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Failed to retrieve user information',
              details: retryError.message,
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500,
            }
          );
        }
        
        // We can proceed with the user data we have
        userData.credits = retryData.credits;
        // received_free_credits is assumed to be false since we just created the column
        userData.received_free_credits = false;
      } else {
        console.error('Error fetching user profile:', userError);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Failed to retrieve user information',
            details: userError.message,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }
    }
    
    console.log('User data retrieved:', userData);
    
    // Check if the user has already claimed free credits
    if (userData.received_free_credits) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'You have already claimed your free credits',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    // Begin a transaction to update the user's credits and mark as received
    const currentCredits = userData.credits || 0;
    const newCreditTotal = currentCredits + creditsToAdd;
    
    // Insert entry in credit_ledger
    const { error: ledgerError } = await supabase
      .from('credit_ledger')
      .insert({
        user_id: userId,
        change: creditsToAdd,
        reason: 'free_credits',
        ref_id: 'welcome_bonus'
      });
    
    if (ledgerError) {
      console.error('Error updating credit ledger:', ledgerError);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to update credit ledger',
          details: ledgerError.message,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
    
    // Update the user's profile with new credits total and mark as received
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        credits: newCreditTotal,
        received_free_credits: true
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error('Error updating user profile:', updateError);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to update user credits',
          details: updateError.message,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `${creditsToAdd} free credits have been added to your account`,
        creditsAdded: creditsToAdd,
        newTotal: newCreditTotal,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error('Unexpected error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
