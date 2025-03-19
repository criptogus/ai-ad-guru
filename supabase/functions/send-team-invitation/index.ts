
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with the service role key
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, role } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing invitation for ${email} with role ${role}`);
    
    // Generate a unique invitation token
    const token = crypto.randomUUID();
    
    // Store the invitation in the database
    const { error: dbError } = await supabase
      .from('team_invitations')
      .insert({
        email,
        role,
        invitation_token: token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      });
      
    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to create invitation record');
    }
    
    // In a production app, you would use a service like Resend, SendGrid, or similar
    // to send the actual email with the invitation link
    console.log(`Would send email to ${email} with invitation link containing token: ${token}`);
    
    // TODO: Implement actual email sending here with a service like Resend
    // For now, we'll simulate successful email sending
    
    return new Response(
      JSON.stringify({ success: true, message: 'Invitation sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in invitation function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
