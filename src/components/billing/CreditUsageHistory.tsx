
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Minus } from "lucide-react";
import { getUserCreditHistory, CreditUsage } from "@/services";

interface CreditUsageHistoryProps {
  userId: string;
}

const CreditUsageHistory: React.FC<CreditUsageHistoryProps> = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [creditHistory, setCreditHistory] = useState<CreditUsage[]>([]);

  useEffect(() => {
    const fetchCreditHistory = async () => {
      setIsLoading(true);
      try {
        const history = await getUserCreditHistory(userId);
        setCreditHistory(history);
      } catch (error) {
        console.error("Error fetching credit history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreditHistory();
  }, [userId]);

  // Helper function to format the action type for display
  const formatActionType = (action: string) => {
    return action
      .split(/[._]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (creditHistory.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No credit usage history available.
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Credits</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creditHistory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {format(new Date(item.createdAt), "MMM d, yyyy h:mm a")}
              </TableCell>
              <TableCell>{formatActionType(item.action)}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell className="text-right font-medium">
                <div className="flex items-center justify-end">
                  {item.amount < 0 ? (
                    <Plus className="h-4 w-4 mr-1 text-green-600" />
                  ) : (
                    <Minus className="h-4 w-4 mr-1 text-red-600" />
                  )}
                  {Math.abs(item.amount)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CreditUsageHistory;
