
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/contexts/CreditsContext';
import { toast as sonnerToast } from 'sonner';

export const useCreditsManager = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { refreshCredits } = useCredits();

  // Detailed credit balance check
  const checkCreditBalance = useCallback(async (requiredCredits: number) => {
    if (!user?.id) {
      console.error('Attempted to check credits without authenticated user');
      toast({
        title: "Authentication required",
        description: "You need to be logged in to continue",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log(`Checking credit balance for user ${user.id}, required credits: ${requiredCredits}`);
      
      // Get updated balance directly from the database
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();
  
      if (error) {
        console.error('Error checking credit balance:', error);
        toast({
          title: "Error checking credits",
          description: "Failed to verify your credit balance. Please try again.",
          variant: "destructive",
        });
        return false;
      }
      
      if (!data) {
        console.error('User profile not found');
        toast({
          title: "Profile not found",
          description: "Your user profile could not be found",
          variant: "destructive",
        });
        return false;
      }
  
      const available = data.credits || 0;
      console.log(`Credit check result: Available=${available}, Required=${requiredCredits}, Sufficient=${available >= requiredCredits}`);
      
      // Return true if there are enough credits, false otherwise
      return available >= requiredCredits;
    } catch (error) {
      console.error('Unexpected error checking credit balance:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while checking your credits",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  // Credit consumption with detailed logging
  const consumeCredits = useCallback(async (amount: number, reason: string, refId?: string) => {
    if (!user?.id) {
      console.error('Attempted to consume credits without authenticated user');
      toast({
        title: "Authentication required",
        description: "You need to be logged in to continue",
        variant: "destructive",
      });
      return false;
    }

    console.log(`Attempting to consume ${amount} credits for: ${reason}, user: ${user.id}`);
    
    // Check balance before proceeding
    const hasEnough = await checkCreditBalance(amount);
    if (!hasEnough) {
      console.error(`Insufficient credits: required ${amount}`);
      toast({
        title: "Insufficient credits",
        description: `You need ${amount} credits for this operation.`,
        variant: "destructive",
      });
      return false;
    }

    try {
      // Record transaction in the ledger
      const { error } = await supabase
        .from('credit_ledger')
        .insert({
          user_id: user.id,
          change: -amount,
          reason,
          ref_id: refId || reason
        });
  
      if (error) {
        console.error('Error consuming credits:', error);
        toast({
          title: "Error",
          description: "Failed to consume credits. Please try again.",
          variant: "destructive",
        });
        throw new Error(`Failed to consume credits: ${error.message}`);
      }
      
      // Update balance in context
      await refreshCredits();
      
      console.log(`Successfully consumed ${amount} credits for: ${reason}`);
      sonnerToast.success(`${amount} credits used`, {
        description: reason
      });
      
      return true;
    } catch (error) {
      console.error('Unexpected error consuming credits:', error);
      toast({
        title: "Error",
        description: "Failed to consume credits. Please try again.",
        variant: "destructive",
      });
      throw new Error(`Credit consumption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [user, toast, checkCreditBalance, refreshCredits]);

  // Get credit cost for a specific action
  const getActionCreditCost = useCallback((action: string): number => {
    const creditCosts = {
      'website_analysis': 2,
      'ad_generation_per_platform': 5,
      'campaign_publication': 10,
      'audience_analysis': 3,
      'ad_optimization': 5,
      'image_generation': 5,
    };
    
    console.log(`Credit cost for ${action}: ${creditCosts[action as keyof typeof creditCosts] || 0}`);
    return creditCosts[action as keyof typeof creditCosts] || 0;
  }, []);

  // Get transaction history
  const getCreditTransactions = useCallback(async (limit = 10) => {
    if (!user?.id) return [];
    
    try {
      const { data, error } = await supabase
        .from('credit_ledger')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) {
        console.error('Error fetching credit history:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching history:', error);
      return [];
    }
  }, [user]);

  return {
    checkCreditBalance,
    consumeCredits,
    getActionCreditCost,
    getCreditTransactions
  };
};
