
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Lock, Shield, Activity, RefreshCw, Check, X, Calendar, Download } from 'lucide-react';
import { securityMonitor, securityAudit } from '@/middleware/securityMiddleware';
import { formatDistanceToNow } from 'date-fns';

interface SecurityEvent {
  timestamp: string;
  event: string;
  level: 'info' | 'warn' | 'error';
  userId?: string;
  [key: string]: any;
}

const SecurityDashboard: React.FC = () => {
  const [securityLogs, setSecurityLogs] = useState<SecurityEvent[]>([]);
  const [securityScore, setSecurityScore] = useState(0);
  const [lastAuditDate, setLastAuditDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load security logs from localStorage
  useEffect(() => {
    try {
      const logs = JSON.parse(localStorage.getItem('security_logs') || '[]') as SecurityEvent[];
      setSecurityLogs(logs);
      
      // Calculate security score based on log severity
      const errorCount = logs.filter(log => log.level === 'error').length;
      const warnCount = logs.filter(log => log.level === 'warn').length;
      
      // Formula: 100 - (errors * 10) - (warnings * 2)
      let score = 100 - (errorCount * 10) - (warnCount * 2);
      score = Math.max(0, Math.min(100, score)); // Clamp between 0 and 100
      
      setSecurityScore(score);
      
      // Get last audit date
      const lastAudit = localStorage.getItem('last_security_audit_date');
      setLastAuditDate(lastAudit);
      
    } catch (error) {
      console.error('Error loading security logs:', error);
    }
  }, []);

  // Run security audit
  const runSecurityAudit = async () => {
    setIsLoading(true);
    
    try {
      const result = await securityAudit.checkDependencies();
      
      // Log the audit result
      securityMonitor.log('security_audit_completed', {
        result
      });
      
      // Update the last audit date
      const now = new Date().toISOString();
      localStorage.setItem('last_security_audit_date', now);
      setLastAuditDate(now);
      
      // Refresh logs
      const logs = JSON.parse(localStorage.getItem('security_logs') || '[]') as SecurityEvent[];
      setSecurityLogs(logs);
      
      // Show success message
      alert('Security audit completed successfully');
    } catch (error) {
      console.error('Error running security audit:', error);
      securityMonitor.log('security_audit_error', {
        error: error.message || 'Unknown error'
      }, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear security logs
  const clearSecurityLogs = () => {
    if (confirm('Are you sure you want to clear all security logs? This action cannot be undone.')) {
      localStorage.setItem('security_logs', '[]');
      setSecurityLogs([]);
    }
  };

  // Export security logs as JSON
  const exportSecurityLogs = () => {
    const logs = JSON.stringify(securityLogs, null, 2);
    const blob = new Blob([logs], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  };

  // Get severity badge color
  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warn': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get security score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor security events and run audits
          </p>
        </div>
        <Button
          onClick={runSecurityAudit}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
          Run Security Audit
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(securityScore)}`}>
              {securityScore}/100
            </div>
            <p className="text-xs text-muted-foreground">
              {securityScore >= 90 
                ? 'Excellent security posture' 
                : securityScore >= 70 
                  ? 'Good security, some improvements needed' 
                  : 'Poor security, immediate action required'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Audit</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastAuditDate 
                ? formatDistanceToNow(new Date(lastAuditDate), { addSuffix: true }) 
                : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastAuditDate 
                ? `Full audit completed ${new Date(lastAuditDate).toLocaleDateString()}` 
                : 'No security audit has been performed'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityLogs.length}</div>
            <div className="flex gap-2 mt-1">
              <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-800 border border-red-200">
                {securityLogs.filter(log => log.level === 'error').length} Errors
              </span>
              <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 border border-yellow-200">
                {securityLogs.filter(log => log.level === 'warn').length} Warnings
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="warnings">Warnings</TabsTrigger>
            <TabsTrigger value="info">Information</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportSecurityLogs}>
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
            <Button variant="outline" size="sm" onClick={clearSecurityLogs}>
              <X className="h-4 w-4 mr-2" />
              Clear Logs
            </Button>
          </div>
        </div>

        <TabsContent value="all">
          {securityLogs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Check className="h-8 w-8 text-muted-foreground mb-4" />
                  <p className="font-medium">No security events recorded</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your application is running smoothly with no recorded security events
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {securityLogs.map((log, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getSeverityColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="text-base font-semibold mb-2">{log.event.replace(/_/g, ' ')}</h4>
                      <pre className="bg-slate-50 dark:bg-slate-900 p-2 rounded text-xs overflow-x-auto">
                        {JSON.stringify(log, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="errors">
          <Card>
            <CardContent className="pt-6">
              {securityLogs.filter(log => log.level === 'error').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Check className="h-8 w-8 text-green-500 mb-4" />
                  <p className="font-medium">No errors detected</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your application is running without any security errors
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {securityLogs
                    .filter(log => log.level === 'error')
                    .map((log, index) => (
                      <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-800 border border-red-200">
                            ERROR
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="text-base font-semibold mb-2">{log.event.replace(/_/g, ' ')}</h4>
                        <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log, null, 2)}
                        </pre>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Similar content for warnings and info tabs - simplified for brevity */}
        <TabsContent value="warnings">
          <Card>
            <CardContent className="pt-6">
              {securityLogs.filter(log => log.level === 'warn').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Check className="h-8 w-8 text-green-500 mb-4" />
                  <p className="font-medium">No warnings detected</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {securityLogs
                    .filter(log => log.level === 'warn')
                    .map((log, index) => (
                      <div key={index} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 border border-yellow-200">
                            WARNING
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="text-base font-semibold mb-2">{log.event.replace(/_/g, ' ')}</h4>
                        <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log, null, 2)}
                        </pre>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardContent className="pt-6">
              {securityLogs.filter(log => log.level === 'info').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground mb-4" />
                  <p className="font-medium">No information events</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {securityLogs
                    .filter(log => log.level === 'info')
                    .map((log, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 border border-blue-200">
                            INFO
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="text-base font-semibold mb-2">{log.event.replace(/_/g, ' ')}</h4>
                        <pre className="bg-slate-50 dark:bg-slate-900 p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log, null, 2)}
                        </pre>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Best Practices</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Conduct regular security audits (recommended monthly)</li>
              <li>Keep all dependencies updated to the latest secure versions</li>
              <li>Enable two-factor authentication for all administrator accounts</li>
              <li>Regularly review access logs for suspicious activities</li>
              <li>Ensure all API endpoints are properly authenticated and authorized</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default SecurityDashboard;
