
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "npm:resend@2.0.0";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with the service role key
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Resend
const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';
const resend = new Resend(resendApiKey);

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
    
    // Application URL for the invitation link - in production, use a real domain
    const appUrl = Deno.env.get('APP_URL') || 'http://localhost:3000';
    const invitationLink = `${appUrl}/accept-invitation?token=${token}`;
    
    // Prepare email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You're invited to join our team!</h2>
        <p>You have been invited to join our team as a <strong>${role}</strong>.</p>
        <p>Click the button below to accept this invitation:</p>
        <a href="${invitationLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Accept Invitation
        </a>
        <p>This invitation will expire in 7 days.</p>
        <p>If you did not request this invitation, please ignore this email.</p>
      </div>
    `;
    
    try {
      // Send the actual email with Resend
      console.log('Sending invitation email to:', email);
      
      const emailResponse = await resend.emails.send({
        from: 'AI Ad Manager <onboarding@resend.dev>', // Update with your verified domain in production
        to: [email],
        subject: 'You have been invited to join our team',
        html: emailHtml,
      });
      
      console.log('Email sent successfully:', emailResponse);
      
      // Even if there's an error with Resend in testing mode, we'll consider the invitation sent
      // since the record has been created in the database
    } catch (emailError) {
      console.error('Email sending error (will continue):', emailError);
      // We'll continue even if the email fails, since this could be due to Resend's testing mode limitation
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invitation record created successfully',
        note: 'In development mode, actual emails may only be sent to the owner of the Resend account. Check the invitation in the database.'
      }),
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
