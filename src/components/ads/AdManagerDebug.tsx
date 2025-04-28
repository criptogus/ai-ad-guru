
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/contexts/CreditsContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const AdManagerDebug: React.FC = () => {
  const { user } = useAuth();
  const { credits, refreshCredits } = useCredits();
  
  const addTestCredits = async () => {
    if (!user) return;
    
    try {
      // Adicionar 10 créditos para teste
      const { error } = await supabase
        .from('credit_ledger')
        .insert({
          user_id: user.id,
          change: 10,
          reason: 'test_credit_addition',
          ref_id: 'debug_panel'
        });
        
      if (error) {
        console.error('Erro ao adicionar créditos de teste:', error);
        toast.error('Erro ao adicionar créditos');
      } else {
        toast.success('10 créditos de teste adicionados');
        refreshCredits();
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
    }
  };
  
  const testCreditDebiting = async () => {
    if (!user) return;
    
    try {
      // Testar débito de 1 crédito
      const { error } = await supabase
        .from('credit_ledger')
        .insert({
          user_id: user.id,
          change: -1,
          reason: 'test_credit_deduction',
          ref_id: 'debug_panel'
        });
        
      if (error) {
        console.error('Erro ao testar débito de créditos:', error);
        toast.error('Erro ao testar débito');
      } else {
        toast.success('1 crédito debitado com sucesso');
        refreshCredits();
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
    }
  };
  
  return (
    <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
          Painel de Depuração (Créditos)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Saldo de créditos:</span>
            <span className="font-medium">{credits}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Usuário:</span>
            <span className="font-mono text-xs">{user?.id?.substring(0, 8)}...</span>
          </div>
          
          <div className="flex gap-2 mt-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-7"
              onClick={refreshCredits}
            >
              Atualizar Saldo
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-7"
              onClick={addTestCredits}
            >
              +10 Créditos
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-7"
              onClick={testCreditDebiting}
            >
              Testar Débito
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdManagerDebug;
