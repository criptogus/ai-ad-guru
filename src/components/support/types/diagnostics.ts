
/**
 * Connection Diagnostics Types
 */

export type DiagnosticStatus = 'unchecked' | 'checking' | 'success' | 'error';

export interface DiagnosticResult {
  status: DiagnosticStatus;
  error: string | null;
}

export interface ConnectionDiagnosticsProps {
  className?: string;
}
