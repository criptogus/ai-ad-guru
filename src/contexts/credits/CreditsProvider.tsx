
import React, { createContext, useContext } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CreditsContextType, CreditsProviderProps } from './types';
import { useCreditsState } from './useCreditsState';
import { useCreditsListener } from './useCreditsListener';
import { usePeriodicRefresh } from './usePeriodicRefresh';

const CreditsContext = createContext<CreditsContextType>({
  credits: 0,
  loading: false,
  error: null,
  deductCredits: async () => false,
  refreshCredits: async () => {},
});

export const useCredits = () => useContext(CreditsContext);

export const CreditsProvider: React.FC<CreditsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { credits, loading, error, deductCredits, refreshCredits } = useCreditsState(user?.id);
  
  // Set up real-time listener for credit changes
  useCreditsListener(user?.id, refreshCredits);
  
  // Set up periodic refresh
  usePeriodicRefresh(user?.id, refreshCredits);

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
