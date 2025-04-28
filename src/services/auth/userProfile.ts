
import { supabase } from '@/integrations/supabase/client';
import { CustomUser, Profile } from '@/types/auth';
import { User } from '@supabase/supabase-js';

// Helper function to fetch user profile from Supabase
export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('Fetching profile for user ID:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    console.log('Profile data retrieved:', data);
    return data as Profile;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};

// Helper function to update the user object with profile data
export const createCustomUserWithProfile = async (authUser: User): Promise<CustomUser> => {
  console.log('Creating custom user with profile for:', authUser.id);
  try {
    const profile = await fetchUserProfile(authUser.id);
    
    if (profile) {
      console.log('Profile found, creating customUser with profile data');
      const customUser: CustomUser = {
        ...authUser,
        name: profile.name,
        avatar: profile.avatar || '',
        credits: profile.credits,
        hasPaid: profile.has_paid,
        receivedFreeCredits: profile.received_free_credits
      };
      
      return customUser;
    } else {
      console.log('No profile found, creating basic customUser');
      // Fallback to just the auth user if profile isn't found
      const customUser: CustomUser = {
        ...authUser,
        name: authUser.user_metadata?.name || 'User',
        avatar: '',
        credits: 0,
        hasPaid: false,
        receivedFreeCredits: false
      };
      
      return customUser;
    }
  } catch (error) {
    console.error('Error in createCustomUserWithProfile:', error);
    // Return a basic user object to prevent authentication failures if profile has issues
    const basicUser: CustomUser = {
      ...authUser,
      name: authUser.user_metadata?.name || 'User',
      avatar: '',
      credits: 0,
      hasPaid: false,
      receivedFreeCredits: false
    };
    
    return basicUser;
  }
};

// Update user's payment status
export const updatePaymentStatus = async (userId: string, hasPaid: boolean) => {
  const { error } = await supabase
    .from('profiles')
    .update({ has_paid: hasPaid })
    .eq('id', userId);
    
  if (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};
