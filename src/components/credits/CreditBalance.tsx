
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Coins, Loader2, RefreshCw, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const CreditBalance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: balance, isLoading, refetch } = useQuery({
    queryKey: ['credit-balance', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credit_balance')
        .select('total_credits')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      return data?.total_credits || 0;
    },
    enabled: !!user?.id,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading credits...</span>
      </div>
    );
  }

  // Animation for low credits warning
  const isLowCredits = (balance || 0) < 10;

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
                isLowCredits 
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
                  : "bg-primary/10"
              }`}
            >
              {isLowCredits ? (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Coins className="h-4 w-4" />
                </motion.div>
              ) : (
                <Coins className="h-4 w-4" />
              )}
              <span className="font-medium">{balance}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Your available credits</p>
            {isLowCredits && <p className="text-red-500">Low credits! Consider purchasing more.</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="flex gap-1">
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
        
        <Button variant="outline" size="sm" onClick={() => navigate('/billing')}>
          <DollarSign className="h-4 w-4 mr-1" />
          <span>Buy Credits</span>
        </Button>
      </div>
    </div>
  );
};
