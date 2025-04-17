
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";

interface CreditBalanceChartProps {
  userId?: string;
  days?: number;
}

const CreditBalanceChart: React.FC<CreditBalanceChartProps> = ({
  userId,
  days = 30,
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchBalanceHistory = async () => {
      setIsLoading(true);
      try {
        // Get all credit ledger entries for the period
        const { data, error } = await supabase
          .from("credit_ledger")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          // Process data to create running balance over time
          let runningBalance = 0;
          const balancePoints = data.map((entry) => {
            runningBalance += entry.change;
            return {
              date: entry.created_at,
              balance: runningBalance,
            };
          });

          // Add today's date with current balance if needed
          const lastDate = new Date(balancePoints[balancePoints.length - 1].date);
          const today = new Date();
          if (lastDate.getDate() !== today.getDate() || 
              lastDate.getMonth() !== today.getMonth() || 
              lastDate.getFullYear() !== today.getFullYear()) {
            balancePoints.push({
              date: today.toISOString(),
              balance: runningBalance
            });
          }

          setChartData(balancePoints);
        } else {
          // No data, just show zero
          setChartData([
            { date: new Date(Date.now() - days * 86400000).toISOString(), balance: 0 },
            { date: new Date().toISOString(), balance: 0 },
          ]);
        }
      } catch (error) {
        console.error("Error fetching credit balance history:", error);
        // Set fallback data
        setChartData([
          { date: new Date(Date.now() - days * 86400000).toISOString(), balance: 0 },
          { date: new Date().toISOString(), balance: 0 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalanceHistory();
  }, [userId, days]);

  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), "MMM dd");
  };

  if (isLoading) {
    return <Skeleton className="w-full h-72" />;
  }

  return (
    <div className="w-full">
      <h3 className="font-medium text-lg mb-4">Credit Balance History</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip
              formatter={(value: number) => [`${value} credits`, "Balance"]}
              labelFormatter={(label) => format(parseISO(label), "MMM dd, yyyy")}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorBalance)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CreditBalanceChart;
