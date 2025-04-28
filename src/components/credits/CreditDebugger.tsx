
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/contexts/CreditsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CreditTransaction {
  id: string;
  change: number;
  reason: string;
  created_at: string;
  ref_id?: string;
}

export const CreditDebugger = () => {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { credits, refreshCredits } = useCredits();
  
  const loadTransactions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('credit_ledger')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) {
        console.error("Erro ao carregar transações:", error);
      } else {
        setTransactions(data as CreditTransaction[]);
      }
    } catch (err) {
      console.error("Erro ao buscar histórico de créditos:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadTransactions();
  }, [user]);
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Debug de Créditos</CardTitle>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => {
            refreshCredits();
            loadTransactions();
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Carregando...' : 'Atualizar'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between">
            <span>Saldo atual:</span>
            <span className="font-bold">{credits}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>ID do usuário:</span>
            <span>{user?.id}</span>
          </div>
        </div>
        
        <div className="border rounded-md">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left text-sm">Data/Hora</th>
                <th className="p-2 text-right text-sm">Valor</th>
                <th className="p-2 text-left text-sm">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-muted-foreground">
                    Nenhuma transação encontrada
                  </td>
                </tr>
              )}
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t">
                  <td className="p-2 text-xs">{formatDateTime(tx.created_at)}</td>
                  <td className={`p-2 text-right font-medium ${tx.change > 0 ? 'text-green-600' : 'text-blue-600'}`}>
                    {tx.change > 0 ? `+${tx.change}` : tx.change}
                  </td>
                  <td className="p-2 text-sm">
                    {tx.reason}
                    {tx.ref_id && (
                      <div className="text-xs text-muted-foreground">{tx.ref_id}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditDebugger;
