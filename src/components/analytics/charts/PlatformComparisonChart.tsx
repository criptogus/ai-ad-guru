
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface PlatformComparisonChartProps {
  data: {
    platform: string;
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cost: number;
  }[];
}

const PlatformComparisonChart: React.FC<PlatformComparisonChartProps> = ({ data }) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="platform" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="impressions" name="Impressions" fill="#4285F4" />
          <Bar dataKey="clicks" name="Clicks" fill="#34A853" />
          <Bar dataKey="conversions" name="Conversions" fill="#EA4335" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlatformComparisonChart;
