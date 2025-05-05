
import React, { forwardRef, useImperativeHandle } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DiagnosticStatus } from '../types/diagnostics';
import { checkTableExists, getTableColumns } from '../utils/databaseUtils';

interface OAuthStateTest {
  id: string;
  platform: string;
  redirect_uri: string;
  created_at: string;
  expires_at: string;
  user_id: string;
}

interface OAuthStateTestProps {
  status: DiagnosticStatus;
  error: string | null;
  onStatusChange: (status: DiagnosticStatus, error: string | null) => void;
}

const OAuthStateTest = forwardRef<{ runTest: () => Promise<boolean> }, OAuthStateTestProps>(({ 
  status, 
  error, 
  onStatusChange 
}, ref) => {
  
  const runTest = async (): Promise<boolean> => {
    try {
      onStatusChange('checking', null);
      
      // First check if the table exists
      const tableExists = await checkTableExists('oauth_states');
      
      if (!tableExists) {
        console.error('OAuth state table does not exist');
        onStatusChange('error', 'The oauth_states table does not exist');
        return false;
      }
      
      // Get the structure of the table to see what columns it has
      const columns = await getTableColumns('oauth_states');
      console.log('OAuth state table columns:', columns);
      
      // Generate a unique test ID
      const testId = crypto.randomUUID();
      const testUserId = '00000000-0000-0000-0000-000000000000'; // Dummy UUID
      
      // First check if we have the minimum required columns for OAuth state
      const requiredColumns = ['platform', 'redirect_uri'];
      const missingColumns = requiredColumns.filter(col => !columns.includes(col));
      
      if (missingColumns.length > 0) {
        onStatusChange('error', `Table is missing required columns: ${missingColumns.join(', ')}`);
        return false;
      }
      
      // Build insert object with all required fields
      const insertData = {
        id: testId,
        platform: 'test',
        redirect_uri: 'https://example.com',
        user_id: testUserId,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 60000).toISOString()
      };
      
      // Insert test record - using type assertion to bypass the type check
      const { error: insertError } = await supabase
        .from('oauth_states' as any)
        .insert(insertData as any);
      
      if (insertError) {
        console.error('OAuth state insert error:', insertError);
        onStatusChange('error', `Insert error: ${insertError.message}`);
        return false;
      }
      
      // Try to delete the test record to clean up
      await supabase
        .from('oauth_states' as any)
        .delete()
        .eq('id', testId);
      
      onStatusChange('success', null);
      return true;
    } catch (error: any) {
      console.error('OAuth state diagnostic exception:', error);
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
        <h3 className="font-medium">OAuth State Table</h3>
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

OAuthStateTest.displayName = 'OAuthStateTest';

export default OAuthStateTest;
