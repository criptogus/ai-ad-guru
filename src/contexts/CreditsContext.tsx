
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

  // Fetch the user's credits when the component mounts or the user changes
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

        // This is a mock implementation since we don't have the actual database structure
        // In a real app, you would fetch the user's credits from your database
        const { data, error } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching credits:', error);
          setError('Failed to load credits');
          // Set mock credits for now
          setCredits(100);
        } else if (data) {
          setCredits(data.credits);
        } else {
          // Set default credits if no data is found
          setCredits(100);
        }
      } catch (err) {
        console.error('Unexpected error fetching credits:', err);
        setError('An unexpected error occurred');
        // Set mock credits for now
        setCredits(100);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [user]);

  // Function to deduct credits from the user's account
  const deductCredits = async (amount: number): Promise<boolean> => {
    if (!user) {
      toast.error('Please login to use credits');
      return false;
    }

    // Check if the user has enough credits
    if (credits < amount && amount > 0) {
      toast.error('Not enough credits', {
        description: 'Please purchase more credits to continue'
      });
      return false;
    }

    try {
      setError(null);

      // In a real app, you would update the user's credits in your database
      // and handle any concurrency issues
      const { error } = await supabase
        .from('profiles')
        .update({ credits: credits - amount })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating credits:', error);
        setError('Failed to update credits');
        return false;
      }

      // Update the local state
      setCredits(prev => prev - amount);
      return true;
    } catch (err) {
      console.error('Unexpected error updating credits:', err);
      setError('An unexpected error occurred');
      return false;
    }
  };

  // Function to refresh the user's credits
  const refreshCredits = async (): Promise<void> => {
    if (!user) {
      setCredits(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error refreshing credits:', error);
        setError('Failed to refresh credits');
      } else if (data) {
        setCredits(data.credits);
      }
    } catch (err) {
      console.error('Unexpected error refreshing credits:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

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
