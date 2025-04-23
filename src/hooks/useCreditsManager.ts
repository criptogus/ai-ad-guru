
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/contexts/CreditsContext';

export const useCreditsManager = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { refreshCredits } = useCredits();

  // Check if the user has enough credits for an action
  const checkCreditBalance = useCallback(async (requiredCredits: number) => {
    if (!user?.id) return false;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();
  
      if (error || !data) {
        console.error('Error checking credit balance:', error);
        toast({
          title: "Erro ao verificar créditos",
          description: "Não foi possível verificar seu saldo de créditos.",
          variant: "destructive",
        });
        return false;
      }
  
      console.log(`Credit check: Required ${requiredCredits}, Available ${data.balance || 0}`);
      return (data.credits || 0) >= requiredCredits;
    } catch (error) {
      console.error('Unexpected error checking credit balance:', error);
      return false;
    }
  }, [user, toast]);

  // Consume credits for an action
  const consumeCredits = useCallback(async (amount: number, reason: string, refId?: string) => {
    if (!user?.id) {
      toast({
        title: "Autenticação necessária",
        description: "Você precisa estar logado para continuar",
        variant: "destructive",
      });
      return false;
    }

    const hasEnough = await checkCreditBalance(amount);
    if (!hasEnough) {
      toast({
        title: "Créditos insuficientes",
        description: `Você precisa de ${amount} créditos para esta operação.`,
        variant: "destructive",
      });
      return false;
    }

    try {
      // Add entry to credit ledger
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
          title: "Erro",
          description: "Falha ao consumir créditos. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }
      
      // Refresh credit balance in the context
      await refreshCredits();
      
      return true;
    } catch (error) {
      console.error('Unexpected error consuming credits:', error);
      toast({
        title: "Erro",
        description: "Falha ao consumir créditos. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast, checkCreditBalance, refreshCredits]);

  // Get the price in credits for a specific action
  const getActionCreditCost = useCallback((action: string): number => {
    const creditCosts = {
      'website_analysis': 2,
      'ad_generation_per_platform': 5,
      'campaign_publication': 10,
      'audience_analysis': 3,
      'ad_optimization': 5,
    };
    
    return creditCosts[action as keyof typeof creditCosts] || 0;
  }, []);

  return {
    checkCreditBalance,
    consumeCredits,
    getActionCreditCost
  };
};
