
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

  // Verificação detalhada do saldo de créditos
  const checkCreditBalance = useCallback(async (requiredCredits: number) => {
    if (!user?.id) {
      console.error('Tentativa de verificar créditos sem usuário autenticado');
      return false;
    }

    try {
      // Obter saldo atualizado diretamente do banco
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();
  
      if (error || !data) {
        console.error('Erro ao verificar saldo de créditos:', error);
        toast({
          title: "Erro ao verificar créditos",
          description: "Não foi possível verificar seu saldo de créditos. Por favor, tente novamente.",
          variant: "destructive",
        });
        return false;
      }
  
      const disponivel = data.credits || 0;
      console.log(`Verificação de créditos: Necessário ${requiredCredits}, Disponível ${disponivel}`);
      
      // Retorna true se tiver créditos suficientes, false caso contrário
      return disponivel >= requiredCredits;
    } catch (error) {
      console.error('Erro inesperado ao verificar saldo de créditos:', error);
      return false;
    }
  }, [user, toast]);

  // Consumo de créditos com log detalhado
  const consumeCredits = useCallback(async (amount: number, reason: string, refId?: string) => {
    if (!user?.id) {
      console.error('Tentativa de consumir créditos sem usuário autenticado');
      toast({
        title: "Autenticação necessária",
        description: "Você precisa estar logado para continuar",
        variant: "destructive",
      });
      return false;
    }

    console.log(`Tentativa de consumir ${amount} créditos para: ${reason}`);
    
    // Verificar saldo antes de prosseguir
    const hasEnough = await checkCreditBalance(amount);
    if (!hasEnough) {
      console.error(`Créditos insuficientes: necessário ${amount}`);
      toast({
        title: "Créditos insuficientes",
        description: `Você precisa de ${amount} créditos para esta operação.`,
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log(`Consumindo ${amount} créditos para: ${reason}`);
      
      // Registrar transação no ledger
      const { error } = await supabase
        .from('credit_ledger')
        .insert({
          user_id: user.id,
          change: -amount,
          reason,
          ref_id: refId || reason
        });
  
      if (error) {
        console.error('Erro ao consumir créditos:', error);
        toast({
          title: "Erro",
          description: "Falha ao consumir créditos. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }
      
      // Atualizar saldo em contexto
      await refreshCredits();
      
      console.log(`${amount} créditos consumidos com sucesso para: ${reason}`);
      sonnerToast.success(`${amount} créditos utilizados`, {
        description: reason
      });
      
      return true;
    } catch (error) {
      console.error('Erro inesperado ao consumir créditos:', error);
      toast({
        title: "Erro",
        description: "Falha ao consumir créditos. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast, checkCreditBalance, refreshCredits]);

  // Obter custo de créditos para uma ação específica
  const getActionCreditCost = useCallback((action: string): number => {
    const creditCosts = {
      'website_analysis': 2,
      'ad_generation_per_platform': 5,
      'campaign_publication': 10,
      'audience_analysis': 3,
      'ad_optimization': 5,
      'image_generation': 5,
    };
    
    console.log(`Custo de créditos para ${action}: ${creditCosts[action as keyof typeof creditCosts] || 0}`);
    return creditCosts[action as keyof typeof creditCosts] || 0;
  }, []);

  // Verificar histórico de transações
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
        console.error('Erro ao buscar histórico de créditos:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Erro inesperado ao buscar histórico:', error);
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
