
import { supabase } from '@/integrations/supabase/client';

// Get the current session
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting current session:', error);
    throw error;
  }
  
  return data.session;
};
