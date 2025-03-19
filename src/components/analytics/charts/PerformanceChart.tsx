
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface PerformanceChartProps {
  data: {
    date: string;
    impressions: number;
    clicks: number;
    ctr: number;
    conversions: number;
  }[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="clicks"
            name="Clicks"
            stroke="#4285F4"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 5 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="conversions"
            name="Conversions"
            stroke="#34A853"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 5 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="ctr"
            name="CTR (%)"
            stroke="#FBBC05"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
