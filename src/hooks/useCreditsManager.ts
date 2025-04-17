
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useCreditsManager = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const checkCreditBalance = useCallback(async (requiredCredits: number) => {
    if (!user?.id) return false;

    const { data, error } = await supabase
      .from('credit_balance')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      console.error('Error checking credit balance:', error);
      return false;
    }

    return data.balance >= requiredCredits;
  }, [user]);

  const consumeCredits = useCallback(async (amount: number, reason: string, refId?: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue",
        variant: "destructive",
      });
      return false;
    }

    const hasEnough = await checkCreditBalance(amount);
    if (!hasEnough) {
      toast({
        title: "Insufficient credits",
        description: "Please purchase more credits to continue",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase
      .from('credit_ledger')
      .insert({
        user_id: user.id,
        change: -amount,
        reason,
        ref_id: refId
      });

    if (error) {
      console.error('Error consuming credits:', error);
      toast({
        title: "Error",
        description: "Failed to consume credits. Please try again.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [user, toast]);

  return {
    checkCreditBalance,
    consumeCredits
  };
};
