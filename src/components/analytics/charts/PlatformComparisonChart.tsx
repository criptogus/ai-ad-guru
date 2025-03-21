
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PlatformComparisonChartProps {
  data: {
    metric: string;
    google: number;
    meta: number;
  }[];
}

const PlatformComparisonChart: React.FC<PlatformComparisonChartProps> = ({ data }) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={30}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "white", 
              borderRadius: "8px", 
              borderColor: "#e2e8f0",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }} 
          />
          <Legend />
          <Bar dataKey="google" fill="#4285F4" name="Google Ads" radius={[4, 4, 0, 0]} />
          <Bar dataKey="meta" fill="#1877F2" name="Meta Ads" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlatformComparisonChart;
