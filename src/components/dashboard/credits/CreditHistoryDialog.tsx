
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Coins, DownloadIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getCreditTransactions } from "@/services/credits/creditsApi";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface CreditHistoryDialogProps {
  maxHeight?: string;
  hideHeader?: boolean;
}

const CreditHistoryDialog: React.FC<CreditHistoryDialogProps> = ({ 
  maxHeight = "500px",
  hideHeader = false
}) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    if (user?.id) {
      const fetchTransactions = async () => {
        setIsLoading(true);
        try {
          const data = await getCreditTransactions(user.id);
          setTransactions(data);
        } catch (error) {
          console.error("Error fetching credit history:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchTransactions();
    }
  }, [user?.id]);

  const handleExportCSV = () => {
    if (!transactions.length) return;
    
    // Convert transactions to CSV
    const headers = ["Date", "Action", "Description", "Amount"];
    const rows = transactions.map(tx => [
      format(new Date(tx.createdAt), "yyyy-MM-dd HH:mm"),
      tx.action,
      tx.description,
      tx.amount,
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `credit-history-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="text-center p-8">
        <Coins className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="font-medium text-lg">No credit activity yet</h3>
        <p className="text-muted-foreground">Your credit transactions will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!hideHeader && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Credit History</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCSV}
            className="gap-2"
          >
            <DownloadIcon className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      )}
      
      <ScrollArea className={`max-h-[${maxHeight}]`}>
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="flex items-center justify-between p-3 border rounded-md text-sm"
            >
              <div className="flex-1">
                <div className="font-medium">{tx.description}</div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(tx.createdAt), "MMM dd, yyyy • HH:mm")}
                </div>
              </div>
              <div className={`font-medium ${tx.amount < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {tx.amount < 0 ? '+' : '-'}{Math.abs(tx.amount)}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CreditHistoryDialog;
