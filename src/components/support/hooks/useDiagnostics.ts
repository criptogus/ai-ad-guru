
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DiagnosticStatus } from '../types/diagnostics';

export interface DiagnosticState {
  status: DiagnosticStatus;
  error: string | null;
}

export const useDiagnostics = () => {
  const { toast } = useToast();
  const [databaseDiagnostic, setDatabaseDiagnostic] = useState<DiagnosticState>({
    status: 'unchecked',
    error: null
  });
  const [edgeFunctionDiagnostic, setEdgeFunctionDiagnostic] = useState<DiagnosticState>({
    status: 'unchecked',
    error: null
  });
  const [oauthStateDiagnostic, setOAuthStateDiagnostic] = useState<DiagnosticState>({
    status: 'unchecked',
    error: null
  });
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  const updateDatabaseStatus = (status: DiagnosticStatus, error: string | null) => {
    setDatabaseDiagnostic({ status, error });
  };

  const updateEdgeFunctionStatus = (status: DiagnosticStatus, error: string | null) => {
    setEdgeFunctionDiagnostic({ status, error });
  };

  const updateOAuthStateStatus = (status: DiagnosticStatus, error: string | null) => {
    setOAuthStateDiagnostic({ status, error });
  };

  return {
    databaseDiagnostic,
    edgeFunctionDiagnostic,
    oauthStateDiagnostic,
    isRunningDiagnostics,
    setIsRunningDiagnostics,
    updateDatabaseStatus,
    updateEdgeFunctionStatus,
    updateOAuthStateStatus,
    toast
  };
};
