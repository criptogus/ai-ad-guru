
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/contexts/CreditsContext';
import { toast } from 'sonner';

export const useCreditsVerification = () => {
  const { user, refreshUser } = useAuth();
  const { refreshCredits } = useCredits();
  const [checking, setChecking] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [hasClaimedFreeCredits, setHasClaimedFreeCredits] = useState(false);
  
  useEffect(() => {
    // Set initial state based on user data
    if (user?.id) {
      setHasClaimedFreeCredits(!!user.receivedFreeCredits);
      
      // Automatically check status when component mounts
      checkFreeCreditsStatus();
    }
  }, [user]);
  
  const checkFreeCreditsStatus = async () => {
    if (!user?.id) return;
    
    try {
      console.log("Checking free credits status for user:", user.id);
      setChecking(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('received_free_credits')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error checking free credits status:', error);
        
        // Check if the column doesn't exist
        if (error.message.includes('column "received_free_credits" does not exist')) {
          console.log('The received_free_credits column does not exist yet. This is expected for older accounts.');
          // You might need to run the migration to add this column
          await executeAddReceivedFreeCreditsColumnMigration();
          return false;
        }
        
        throw error;
      }
      
      console.log('Free credits status data:', data);
      
      // Update local state based on database value
      const hasReceived = !!data?.received_free_credits;
      setHasClaimedFreeCredits(hasReceived);
      
      // If local user state doesn't match database, refresh user data
      if (hasReceived !== user.receivedFreeCredits) {
        console.log('Refreshing user data due to mismatch in free credits status');
        await refreshUser();
        await refreshCredits();
      }
      
      return hasReceived;
    } catch (error) {
      console.error('Error checking free credits status:', error);
      return false;
    } finally {
      setChecking(false);
    }
  };
  
  // Helper function to ensure the received_free_credits column exists
  const executeAddReceivedFreeCreditsColumnMigration = async () => {
    try {
      console.log('Attempting to add received_free_credits column to profiles table');
      
      // Execute the function that adds the column if it doesn't exist
      const { error } = await supabase.rpc('add_column_if_not_exists', {
        table_name: 'profiles',
        column_name: 'received_free_credits',
        column_type: 'boolean'
      });
      
      if (error) {
        console.error('Error running migration:', error);
        return false;
      }
      
      console.log('Successfully ensured received_free_credits column exists');
      return true;
    } catch (err) {
      console.error('Error executing migration:', err);
      return false;
    }
  };
  
  const claimFreeCredits = async (): Promise<boolean> => {
    if (!user?.id || hasClaimedFreeCredits) return false;
    
    try {
      setChecking(true);
      setProcessing(true);
      
      // First, make sure the column exists
      await executeAddReceivedFreeCreditsColumnMigration();
      
      console.log('Claiming free credits for user:', user.id);
      const { data, error } = await supabase.functions.invoke("claim-free-credits", {
        body: { userId: user.id },
      });
      
      console.log('Response from claim-free-credits:', data, error);
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success('Free credits claimed!', {
          description: `${data.creditsAdded || 15} credits have been added to your account.`
        });
        
        // Refresh user data to get updated credit count
        await refreshUser();
        await refreshCredits();
        setHasClaimedFreeCredits(true);
        return true;
      } else {
        throw new Error(data?.message || "Failed to claim free credits");
      }
    } catch (error) {
      console.error('Error claiming free credits:', error);
      toast.error('Failed to claim free credits', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
      return false;
    } finally {
      setChecking(false);
      setProcessing(false);
    }
  };
  
  return {
    checking,
    processing,
    hasClaimedFreeCredits,
    checkFreeCreditsStatus,
    claimFreeCredits
  };
};
