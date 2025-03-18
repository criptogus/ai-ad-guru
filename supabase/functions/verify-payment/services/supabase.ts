
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

// Initialize and return a Supabase client
function getSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

// Look up user by email
export async function findUserByEmail(email: string) {
  console.log('Looking up user by email:', email);
  const supabase = getSupabaseClient();
  
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();
    
  if (userError) {
    console.error('Error looking up user by email:', userError);
    return null;
  }
  
  if (userData) {
    console.log('Found user by email:', userData.id);
    return userData.id;
  }
  
  return null;
}

// Update the user's subscription status in the database
export async function updateUserSubscription(userId: string) {
  console.log('Payment verified as successful. Updating profile for user:', userId);
  const supabase = getSupabaseClient();
  
  try {
    // Update the user's profile to reflect payment
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ has_paid: true })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      throw new Error(`Failed to update user profile: ${updateError.message}`);
    }
    
    // Verify the update was successful
    const { data: updatedProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (verifyError) {
      console.error('Error verifying profile update:', verifyError);
    } else {
      console.log('Profile updated successfully:', updatedProfile);
    }
  } catch (dbError) {
    console.error('Database operation error:', dbError);
    throw new Error(`Database error: ${dbError.message}`);
  }
}
