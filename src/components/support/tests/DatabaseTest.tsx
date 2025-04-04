
import React, { forwardRef, useImperativeHandle } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DiagnosticStatus } from '../types/diagnostics';

interface DatabaseTestProps {
  status: DiagnosticStatus;
  error: string | null;
  onStatusChange: (status: DiagnosticStatus, error: string | null) => void;
}

const DatabaseTest = forwardRef<{ runTest: () => Promise<boolean> }, DatabaseTestProps>(({ 
  status, 
  error, 
  onStatusChange 
}, ref) => {
  
  const runTest = async (): Promise<boolean> => {
    try {
      onStatusChange('checking', null);
      // Simple test query to check database connectivity
      const { error } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
      
      if (error) {
        console.error('Database diagnostic error:', error);
        onStatusChange('error', `Connection error: ${error.message}`);
        return false;
      }
      
      onStatusChange('success', null);
      return true;
    } catch (error: any) {
      console.error('Database diagnostic exception:', error);
      onStatusChange('error', error.message || 'Unknown error');
      return false;
    }
  };
  
  // Expose the runTest method to parent components
  useImperativeHandle(ref, () => ({
    runTest
  }));
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Database Connection</h3>
        {status === 'unchecked' && (
          <Badge variant="outline">Not checked</Badge>
        )}
        {status === 'checking' && (
          <Badge variant="outline" className="animate-pulse">Checking...</Badge>
        )}
        {status === 'success' && (
          <Badge variant="outline" className="border-green-500 text-green-500 bg-green-50 dark:bg-green-950 dark:border-green-700">
            <CheckCircle className="h-3.5 w-3.5 mr-1" /> Success
          </Badge>
        )}
        {status === 'error' && (
          <Badge variant="destructive">
            <XCircle className="h-3.5 w-3.5 mr-1" /> Failed
          </Badge>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
});

DatabaseTest.displayName = 'DatabaseTest';

export default DatabaseTest;
