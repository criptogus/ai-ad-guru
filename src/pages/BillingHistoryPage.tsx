
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreditTransactionsTable from "@/components/billing/CreditTransactionsTable";
import AdSpendFeesTable from "@/components/billing/AdSpendFeesTable";
import CreditBalanceChart from "@/components/billing/CreditBalanceChart";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const BillingHistoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("credits");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch initial data
  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);
  
  // Handle export of all transactions
  const handleExportData = async () => {
    if (!user) return;
    
    try {
      // Get credit ledger entries
      const { data: creditData } = await supabase
        .from('credit_ledger')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      // Get ad spend fees
      const { data: feeData } = await supabase
        .from('ad_spend_fees')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      // Combine and format data for CSV
      const creditRows = (creditData || []).map(item => ({
        date: format(new Date(item.created_at), 'yyyy-MM-dd HH:mm:ss'),
        type: 'Credit Transaction',
        description: item.reason,
        amount: item.change,
        reference: item.ref_id
      }));
      
      const feeRows = (feeData || []).map(item => ({
        date: format(new Date(item.created_at), 'yyyy-MM-dd HH:mm:ss'),
        type: 'Ad Spend Fee',
        description: `Fee for $${item.spend_amount} ad spend`,
        amount: -item.fee_amount,
        reference: item.campaign_id
      }));
      
      const allRows = [...creditRows, ...feeRows].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Convert to CSV
      const headers = ['Date', 'Type', 'Description', 'Amount', 'Reference'];
      const csvContent = [
        headers.join(','),
        ...allRows.map(row => [
          row.date,
          row.type,
          `"${row.description}"`,
          row.amount,
          row.reference
        ].join(','))
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `billing-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };
  
  if (isLoading) {
    return (
      <AppLayout activePage="billing">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout activePage="billing">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/billing')}
              className="mr-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Billing
            </Button>
            <h1 className="text-2xl font-bold">Billing History</h1>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportData}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export All Data
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <CreditBalanceChart userId={user?.id} />
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="credits">Credit Transactions</TabsTrigger>
            <TabsTrigger value="fees">Ad Spend Fees</TabsTrigger>
          </TabsList>
          
          <TabsContent value="credits">
            <Card>
              <CardHeader>
                <CardTitle>Credit Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <CreditTransactionsTable userId={user?.id} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fees">
            <Card>
              <CardHeader>
                <CardTitle>Ad Spend Fees (10%)</CardTitle>
              </CardHeader>
              <CardContent>
                <AdSpendFeesTable userId={user?.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default BillingHistoryPage;
