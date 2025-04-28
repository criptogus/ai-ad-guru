
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/contexts/CreditsContext';

export const useCreditsVerification = () => {
  const { user, refreshUser } = useAuth();
  const { refreshCredits } = useCredits();
  const [checking, setChecking] = useState(false);
  const [hasClaimedFreeCredits, setHasClaimedFreeCredits] = useState(false);
  
  useEffect(() => {
    if (user?.id) {
      setHasClaimedFreeCredits(!!user.receivedFreeCredits);
    }
  }, [user]);
  
  const checkFreeCreditsStatus = async () => {
    if (!user?.id) return;
    
    try {
      setChecking(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('received_free_credits')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      setHasClaimedFreeCredits(!!data?.received_free_credits);
      
      if (data?.received_free_credits !== user.receivedFreeCredits) {
        // Update local user object if the database value is different
        await refreshUser();
        await refreshCredits();
      }
    } catch (error) {
      console.error('Error checking free credits status:', error);
    } finally {
      setChecking(false);
    }
  };
  
  const claimFreeCredits = async (): Promise<boolean> => {
    if (!user?.id || hasClaimedFreeCredits) return false;
    
    try {
      setChecking(true);
      
      const { data, error } = await supabase.functions.invoke("claim-free-credits", {
        body: { userId: user.id },
      });
      
      if (error) throw error;
      
      if (data?.success) {
        await refreshUser();
        await refreshCredits();
        setHasClaimedFreeCredits(true);
        return true;
      } else {
        throw new Error(data?.message || "Failed to claim free credits");
      }
    } catch (error) {
      console.error('Error claiming free credits:', error);
      return false;
    } finally {
      setChecking(false);
    }
  };
  
  return {
    checking,
    hasClaimedFreeCredits,
    checkFreeCreditsStatus,
    claimFreeCredits
  };
};
