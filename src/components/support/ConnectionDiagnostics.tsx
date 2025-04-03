
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type DiagnosticStatus = 'unchecked' | 'checking' | 'success' | 'error';

interface ConnectionDiagnosticsProps {
  className?: string;
}

const ConnectionDiagnostics: React.FC<ConnectionDiagnosticsProps> = ({ className }) => {
  const { toast } = useToast();
  const [databaseStatus, setDatabaseStatus] = useState<DiagnosticStatus>('unchecked');
  const [edgeFunctionStatus, setEdgeFunctionStatus] = useState<DiagnosticStatus>('unchecked');
  const [oauthStateStatus, setOauthStateStatus] = useState<DiagnosticStatus>('unchecked');
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const [edgeFunctionError, setEdgeFunctionError] = useState<string | null>(null);
  const [oauthStateError, setOauthStateError] = useState<string | null>(null);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  const runDatabaseDiagnostic = async (): Promise<boolean> => {
    try {
      setDatabaseStatus('checking');
      // Simple test query to check database connectivity
      const { error } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
      
      if (error) {
        console.error('Database diagnostic error:', error);
        setDatabaseError(`Connection error: ${error.message}`);
        setDatabaseStatus('error');
        return false;
      }
      
      setDatabaseStatus('success');
      setDatabaseError(null);
      return true;
    } catch (error: any) {
      console.error('Database diagnostic exception:', error);
      setDatabaseError(error.message || 'Unknown error');
      setDatabaseStatus('error');
      return false;
    }
  };

  const runEdgeFunctionDiagnostic = async (): Promise<boolean> => {
    try {
      setEdgeFunctionStatus('checking');
      // Invoke a simple edge function ping
      const { error } = await supabase.functions.invoke('create-oauth-states');
      
      if (error) {
        console.error('Edge function diagnostic error:', error);
        setEdgeFunctionError(`Function error: ${error.message}`);
        setEdgeFunctionStatus('error');
        return false;
      }
      
      setEdgeFunctionStatus('success');
      setEdgeFunctionError(null);
      return true;
    } catch (error: any) {
      console.error('Edge function diagnostic exception:', error);
      setEdgeFunctionError(error.message || 'Unknown error');
      setEdgeFunctionStatus('error');
      return false;
    }
  };

  const runOAuthStateDiagnostic = async (): Promise<boolean> => {
    try {
      setOauthStateStatus('checking');
      // Check if we can insert and delete from oauth_states table
      const testState = `test-${Date.now()}`;
      
      // Insert a test record
      const { error: insertError } = await supabase
        .from('oauth_states')
        .insert({
          state: testState,
          user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
          platform: 'test',
          redirect_uri: 'https://example.com',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 60000).toISOString(), // 1 minute from now
        });
      
      if (insertError) {
        console.error('OAuth state insert error:', insertError);
        setOauthStateError(`Insert error: ${insertError.message}`);
        setOauthStateStatus('error');
        return false;
      }
      
      // Delete the test record
      const { error: deleteError } = await supabase
        .from('oauth_states')
        .delete()
        .eq('state', testState);
      
      if (deleteError) {
        console.error('OAuth state delete error:', deleteError);
        setOauthStateError(`Delete error: ${deleteError.message}`);
        setOauthStateStatus('error');
        return false;
      }
      
      setOauthStateStatus('success');
      setOauthStateError(null);
      return true;
    } catch (error: any) {
      console.error('OAuth state diagnostic exception:', error);
      setOauthStateError(error.message || 'Unknown error');
      setOauthStateStatus('error');
      return false;
    }
  };

  const runAllDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    
    try {
      const dbResult = await runDatabaseDiagnostic();
      const fnResult = await runEdgeFunctionDiagnostic();
      const oauthResult = await runOAuthStateDiagnostic();
      
      if (dbResult && fnResult && oauthResult) {
        toast({
          title: "All diagnostics passed",
          description: "Your connection setup appears to be working correctly"
        });
      } else {
        toast({
          title: "Some diagnostics failed",
          description: "Please check the detailed results",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error running diagnostics:', error);
      toast({
        title: "Diagnostics error",
        description: "An unexpected error occurred while running diagnostics",
        variant: "destructive"
      });
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Connection Diagnostics</CardTitle>
        <CardDescription>
          Test your connection setup for ad platform integrations
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Database Connection */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Database Connection</h3>
            {databaseStatus === 'unchecked' && (
              <Badge variant="outline">Not checked</Badge>
            )}
            {databaseStatus === 'checking' && (
              <Badge variant="outline" className="animate-pulse">Checking...</Badge>
            )}
            {databaseStatus === 'success' && (
              <Badge variant="outline" className="border-green-500 text-green-500 bg-green-50 dark:bg-green-950 dark:border-green-700">
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Success
              </Badge>
            )}
            {databaseStatus === 'error' && (
              <Badge variant="destructive">
                <XCircle className="h-3.5 w-3.5 mr-1" /> Failed
              </Badge>
            )}
          </div>
          {databaseError && (
            <p className="text-sm text-red-500 mt-1">{databaseError}</p>
          )}
        </div>
        
        {/* Edge Function */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Edge Function</h3>
            {edgeFunctionStatus === 'unchecked' && (
              <Badge variant="outline">Not checked</Badge>
            )}
            {edgeFunctionStatus === 'checking' && (
              <Badge variant="outline" className="animate-pulse">Checking...</Badge>
            )}
            {edgeFunctionStatus === 'success' && (
              <Badge variant="outline" className="border-green-500 text-green-500 bg-green-50 dark:bg-green-950 dark:border-green-700">
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Success
              </Badge>
            )}
            {edgeFunctionStatus === 'error' && (
              <Badge variant="destructive">
                <XCircle className="h-3.5 w-3.5 mr-1" /> Failed
              </Badge>
            )}
          </div>
          {edgeFunctionError && (
            <p className="text-sm text-red-500 mt-1">{edgeFunctionError}</p>
          )}
        </div>
        
        {/* OAuth State Table */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">OAuth State Table</h3>
            {oauthStateStatus === 'unchecked' && (
              <Badge variant="outline">Not checked</Badge>
            )}
            {oauthStateStatus === 'checking' && (
              <Badge variant="outline" className="animate-pulse">Checking...</Badge>
            )}
            {oauthStateStatus === 'success' && (
              <Badge variant="outline" className="border-green-500 text-green-500 bg-green-50 dark:bg-green-950 dark:border-green-700">
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Success
              </Badge>
            )}
            {oauthStateStatus === 'error' && (
              <Badge variant="destructive">
                <XCircle className="h-3.5 w-3.5 mr-1" /> Failed
              </Badge>
            )}
          </div>
          {oauthStateError && (
            <p className="text-sm text-red-500 mt-1">{oauthStateError}</p>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={runAllDiagnostics} 
          disabled={isRunningDiagnostics}
          className="w-full"
        >
          {isRunningDiagnostics && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
          {isRunningDiagnostics ? 'Running Diagnostics...' : 'Run All Diagnostics'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConnectionDiagnostics;
