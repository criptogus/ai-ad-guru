
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

interface CreditTransactionsTableProps {
  userId?: string;
}

const CreditTransactionsTable: React.FC<CreditTransactionsTableProps> = ({
  userId,
}) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("credit_ledger")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;
        setTransactions(data || []);
      } catch (error) {
        console.error("Error fetching credit transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  const formatReason = (reason: string) => {
    return reason
      .split(/[._]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No credit transactions found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
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
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-medium">
                {format(new Date(tx.created_at), "MMM dd, yyyy h:mm a")}
              </TableCell>
              <TableCell>
                <Badge
                  variant={tx.change > 0 ? "outline" : "secondary"}
                  className={
                    tx.change > 0
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }
                >
                  {tx.change > 0 ? "Purchase" : "Usage"}
                </Badge>
              </TableCell>
              <TableCell>{tx.ref_id || formatReason(tx.reason)}</TableCell>
              <TableCell className="text-right">
                <span
                  className={`flex items-center justify-end ${
                    tx.change > 0 ? "text-green-600" : "text-blue-600"
                  }`}
                >
                  {tx.change > 0 ? (
                    <ArrowUpCircle className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownCircle className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(tx.change)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CreditTransactionsTable;
