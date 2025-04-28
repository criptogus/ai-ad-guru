
import { ReactNode } from 'react';

export interface CreditsContextType {
  credits: number;
  loading: boolean;
  error: string | null;
  deductCredits: (amount: number) => Promise<boolean>;
  refreshCredits: () => Promise<void>;
}

export interface CreditsProviderProps {
  children: ReactNode;
}
