
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { getUserCreditHistory, CreditUsage } from '@/services';

const CreditUsageHistory = () => {
  const [usageHistory, setUsageHistory] = useState<CreditUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsageHistory = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const history = await getUserCreditHistory(user.id);
        setUsageHistory(history);
      } catch (error) {
        console.error('Error fetching credit usage history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageHistory();
  }, [user]);

  const downloadCSV = () => {
    if (!usageHistory.length) return;
    
    const headers = ['Date', 'Action', 'Description', 'Credits Used'];
    const csvRows = [
      headers.join(','),
      ...usageHistory.map(item => {
        const date = format(new Date(item.timestamp), 'yyyy-MM-dd HH:mm');
        return [
          `"${date}"`,
          `"${item.action}"`,
          `"${item.description}"`,
          item.amount
        ].join(',');
      })
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `credit-usage-history-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Credit Usage History</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={downloadCSV}
          disabled={!usageHistory.length || loading}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : usageHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No credit usage history available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Credits Used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usageHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{format(new Date(item.timestamp), 'MMM dd, yyyy')}</TableCell>
                    <TableCell className="capitalize">{item.action.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right font-medium">-{item.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditUsageHistory;
