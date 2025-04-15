
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface CreditInfo {
  total: number;
  used: number;
  available: number;
  lastUpdated: string;
}

interface CreditsContextType {
  credits: CreditInfo | null;
  isLoading: boolean;
  error: string | null;
  refetchCredits: () => Promise<void>;
  deductCredits: (amount: number, operation: string) => Promise<boolean>;
}

const defaultCredits: CreditInfo = {
  total: 100,
  used: 0,
  available: 100,
  lastUpdated: new Date().toISOString()
};

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<CreditInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = async () => {
    if (!user) {
      setCredits(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // For now, just using mock data
      // In a real implementation, this would fetch from an API
      const mockCredits: CreditInfo = {
        ...defaultCredits,
        lastUpdated: new Date().toISOString()
      };
      
      setCredits(mockCredits);
    } catch (err) {
      console.error("Error fetching credits:", err);
      setError("Failed to load credits information");
    } finally {
      setIsLoading(false);
    }
  };

  const deductCredits = async (amount: number, operation: string): Promise<boolean> => {
    if (!user || !credits) return false;
    
    if (credits.available < amount) {
      setError("Insufficient credits for this operation");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call an API
      // For now, just updating the local state
      setCredits({
        ...credits,
        used: credits.used + amount,
        available: credits.available - amount,
        lastUpdated: new Date().toISOString()
      });
      
      return true;
    } catch (err) {
      console.error(`Error deducting ${amount} credits for ${operation}:`, err);
      setError("Failed to update credits");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [user]);

  return (
    <CreditsContext.Provider
      value={{
        credits,
        isLoading,
        error,
        refetchCredits: fetchCredits,
        deductCredits
      }}
    >
      {children}
    </CreditsContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditsProvider");
  }
  return context;
};
