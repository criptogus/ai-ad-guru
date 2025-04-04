
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ConnectionDiagnosticsProps } from './types/diagnostics';
import { useDiagnostics } from './hooks/useDiagnostics';
import DatabaseTest from './tests/DatabaseTest';
import EdgeFunctionTest from './tests/EdgeFunctionTest';
import OAuthStateTest from './tests/OAuthStateTest';

const ConnectionDiagnostics: React.FC<ConnectionDiagnosticsProps> = ({ className }) => {
  const {
    databaseDiagnostic,
    edgeFunctionDiagnostic,
    oauthStateDiagnostic,
    isRunningDiagnostics,
    setIsRunningDiagnostics,
    updateDatabaseStatus,
    updateEdgeFunctionStatus,
    updateOAuthStateStatus,
    toast
  } = useDiagnostics();

  // Using refs to access the test components' runTest methods
  const databaseTestRef = useRef<any>(null);
  const edgeFunctionTestRef = useRef<any>(null);
  const oauthStateTestRef = useRef<any>(null);

  const runAllDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    
    try {
      const dbResult = await databaseTestRef.current?.runTest();
      const fnResult = await edgeFunctionTestRef.current?.runTest();
      const oauthResult = await oauthStateTestRef.current?.runTest();
      
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
        <DatabaseTest
          ref={databaseTestRef}
          status={databaseDiagnostic.status}
          error={databaseDiagnostic.error}
          onStatusChange={updateDatabaseStatus}
        />
        
        {/* Edge Function */}
        <EdgeFunctionTest
          ref={edgeFunctionTestRef}
          status={edgeFunctionDiagnostic.status}
          error={edgeFunctionDiagnostic.error}
          onStatusChange={updateEdgeFunctionStatus}
        />
        
        {/* OAuth State Table */}
        <OAuthStateTest
          ref={oauthStateTestRef}
          status={oauthStateDiagnostic.status}
          error={oauthStateDiagnostic.error}
          onStatusChange={updateOAuthStateStatus}
        />
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
