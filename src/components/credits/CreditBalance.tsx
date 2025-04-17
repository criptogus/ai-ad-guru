
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Coins, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CreditBalance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: balance, isLoading } = useQuery({
    queryKey: ['credit-balance', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credit_balance')
        .select('balance')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      return data?.balance || 0;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading credits...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full">
        <Coins className="h-4 w-4" />
        <span className="font-medium">{balance}</span>
      </div>
      <Button variant="outline" size="sm" onClick={() => navigate('/billing')}>
        Buy Credits
      </Button>
    </div>
  );
};
