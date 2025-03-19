
import React, { useState, useEffect } from "react";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { getCreditUsageHistory, CreditUsage } from "@/services";

interface CreditHistoryDialogProps {
  userId: string;
}

const CreditHistoryDialog: React.FC<CreditHistoryDialogProps> = ({ userId }) => {
  const [creditHistory, setCreditHistory] = useState<CreditUsage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      const history = await getCreditUsageHistory(userId);
      setCreditHistory(history);
      setIsLoading(false);
    };

    if (userId) {
      loadHistory();
    }
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <History className="mr-2 h-4 w-4" /> View Credit History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Credit Usage History</DialogTitle>
          <DialogDescription>
            Your recent credit transactions and usage
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="py-4 text-center">Loading history...</div>
        ) : creditHistory.length === 0 ? (
          <div className="py-4 text-center">No credit history available</div>
        ) : (
          <div className="max-h-[400px] overflow-auto">
            <table className="w-full">
              <thead className="border-b dark:border-gray-700">
                <tr>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Action</th>
                  <th className="text-left py-2">Description</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {creditHistory.map((item) => (
                  <tr key={item.id} className="border-b dark:border-gray-700">
                    <td className="py-2">{formatDate(item.createdAt)}</td>
                    <td className="py-2">{item.action.replace('_', ' ')}</td>
                    <td className="py-2">{item.description}</td>
                    <td className={`py-2 text-right ${item.amount < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.amount < 0 ? '+' : '-'}{Math.abs(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreditHistoryDialog;
