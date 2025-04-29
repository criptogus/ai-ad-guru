
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCreditsState = (userId: string | undefined) => {
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch credits when component mounts or when the user changes
  useEffect(() => {
    const fetchCredits = async () => {
      if (!userId) {
        setCredits(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Buscando saldo de créditos para usuário:", userId);

        const { data, error } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Erro ao buscar créditos:', error);
          setError('Falha ao carregar créditos');
          // Set default credits as fallback
          setCredits(0);
        } else if (data) {
          console.log("Saldo de créditos atualizado:", data.credits);
          setCredits(data.credits || 0);
        } else {
          console.warn("Nenhum perfil encontrado para o usuário");
          setCredits(0);
        }
      } catch (err) {
        console.error('Erro inesperado ao buscar créditos:', err);
        setError('Ocorreu um erro inesperado');
        setCredits(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [userId]);

  // Function to debit credits from user account
  const deductCredits = async (amount: number): Promise<boolean> => {
    if (!userId) {
      toast.error('Por favor, faça login para usar créditos');
      return false;
    }

    // Check if user has enough credits
    if (credits < amount && amount > 0) {
      toast.error('Créditos insuficientes', {
        description: 'Por favor, adquira mais créditos para continuar'
      });
      return false;
    }

    try {
      setError(null);
      console.log(`Debitando ${amount} créditos para usuário ${userId}`);

      // Insert entry in credit_ledger
      const { error } = await supabase
        .from('credit_ledger')
        .insert({ 
          user_id: userId, 
          change: -amount,
          reason: 'manual_debit',
          ref_id: 'via_context_api'
        });

      if (error) {
        console.error('Erro ao atualizar créditos:', error);
        setError('Falha ao atualizar créditos');
        return false;
      }

      // Update local state
      setCredits(prev => prev - amount);
      console.log(`${amount} créditos debitados com sucesso. Novo saldo: ${credits - amount}`);
      return true;
    } catch (err) {
      console.error('Erro inesperado ao atualizar créditos:', err);
      setError('Ocorreu um erro inesperado');
      return false;
    }
  };

  // Function to refresh user credits
  const refreshCredits = async (): Promise<void> => {
    if (!userId) {
      setCredits(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Atualizando saldo de créditos para usuário:", userId);

      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao atualizar créditos:', error);
        setError('Falha ao atualizar créditos');
      } else if (data) {
        console.log("Saldo de créditos atualizado:", data.credits);
        setCredits(data.credits || 0);
      }
    } catch (err) {
      console.error('Erro inesperado ao atualizar créditos:', err);
      setError('Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return { credits, loading, error, deductCredits, refreshCredits };
};
