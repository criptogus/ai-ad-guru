
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign } from "lucide-react";

interface AdSpendFeesTableProps {
  userId?: string;
}

const AdSpendFeesTable: React.FC<AdSpendFeesTableProps> = ({ userId }) => {
  const [fees, setFees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchFees = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("ad_spend_fees")
          .select("*, campaigns(name)")
          .eq("user_id", userId)
          .order("date", { ascending: false })
          .limit(100);

        if (error) throw error;
        setFees(data || []);
      } catch (error) {
        console.error("Error fetching ad spend fees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFees();
  }, [userId]);

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

  if (!fees.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No ad spend fees found. Fees are charged as 10% of your campaign spend.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Campaign</TableHead>
            <TableHead className="text-right">Ad Spend</TableHead>
            <TableHead className="text-right">Fee (10%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fees.map((fee) => (
            <TableRow key={fee.id}>
              <TableCell className="font-medium">
                {format(new Date(fee.date), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>{fee.campaigns?.name || "Unknown Campaign"}</TableCell>
              <TableCell className="text-right">
                ${fee.spend_amount.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <span className="flex items-center justify-end text-amber-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {fee.fee_amount.toFixed(2)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdSpendFeesTable;
