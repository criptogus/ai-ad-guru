
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CreditsContextType {
  credits: number;
  loading: boolean;
  error: string | null;
  deductCredits: (amount: number) => Promise<boolean>;
  refreshCredits: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextType>({
  credits: 0,
  loading: false,
  error: null,
  deductCredits: async () => false,
  refreshCredits: async () => {},
});

export const useCredits = () => useContext(CreditsContext);

interface CreditsProviderProps {
  children: React.ReactNode;
}

export const CreditsProvider: React.FC<CreditsProviderProps> = ({ children }) => {
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Buscar créditos do usuário quando o componente monta ou quando o usuário muda
  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) {
        setCredits(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Buscando saldo de créditos para usuário:", user.id);

        const { data, error } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar créditos:', error);
          setError('Falha ao carregar créditos');
          // Definir créditos padrão como fallback
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
    
    // Configurar um listener para atualizações na tabela de créditos
    const setupCreditsListener = async () => {
      if (!user) return;
      
      try {
        const creditsChannel = supabase
          .channel('credit-changes')
          .on(
            'postgres_changes',
            { 
              event: 'INSERT',
              schema: 'public',
              table: 'credit_ledger',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              console.log('Atualização de créditos detectada:', payload);
              refreshCredits();
            }
          )
          .subscribe();
          
        return () => {
          supabase.removeChannel(creditsChannel);
        };
      } catch (err) {
        console.error('Erro ao configurar listener de créditos:', err);
      }
    };
    
    setupCreditsListener();
  }, [user]);

  // Função para debitar créditos da conta do usuário
  const deductCredits = async (amount: number): Promise<boolean> => {
    if (!user) {
      toast.error('Por favor, faça login para usar créditos');
      return false;
    }

    // Verificar se o usuário tem créditos suficientes
    if (credits < amount && amount > 0) {
      toast.error('Créditos insuficientes', {
        description: 'Por favor, adquira mais créditos para continuar'
      });
      return false;
    }

    try {
      setError(null);
      console.log(`Debitando ${amount} créditos para usuário ${user.id}`);

      // Inserir entrada no credit_ledger
      const { error } = await supabase
        .from('credit_ledger')
        .insert({ 
          user_id: user.id, 
          change: -amount,
          reason: 'manual_debit',
          ref_id: 'via_context_api'
        });

      if (error) {
        console.error('Erro ao atualizar créditos:', error);
        setError('Falha ao atualizar créditos');
        return false;
      }

      // Atualizar estado local
      setCredits(prev => prev - amount);
      console.log(`${amount} créditos debitados com sucesso. Novo saldo: ${credits - amount}`);
      return true;
    } catch (err) {
      console.error('Erro inesperado ao atualizar créditos:', err);
      setError('Ocorreu um erro inesperado');
      return false;
    }
  };

  // Função para atualizar os créditos do usuário
  const refreshCredits = async (): Promise<void> => {
    if (!user) {
      setCredits(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Atualizando saldo de créditos para usuário:", user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
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

  // Configurar um intervalo para atualizar créditos periodicamente
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      refreshCredits();
    }, 60000); // Atualizar a cada minuto
    
    return () => clearInterval(interval);
  }, [user]);

  return (
    <CreditsContext.Provider
      value={{
        credits,
        loading,
        error,
        deductCredits,
        refreshCredits,
      }}
    >
      {children}
    </CreditsContext.Provider>
  );
};
