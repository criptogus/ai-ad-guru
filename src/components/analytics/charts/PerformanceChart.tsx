
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PerformanceChartProps {
  data: {
    day: string;
    impressions: number;
    clicks: number;
    conversions: number;
  }[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
          <XAxis dataKey="day" />
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
          <Area 
            type="monotone" 
            dataKey="impressions" 
            stackId="1" 
            stroke="#8884d8" 
            fill="rgba(136, 132, 216, 0.6)" 
            name="Impressions"
          />
          <Area 
            type="monotone" 
            dataKey="clicks" 
            stackId="1" 
            stroke="#82ca9d" 
            fill="rgba(130, 202, 157, 0.6)" 
            name="Clicks"
          />
          <Area 
            type="monotone" 
            dataKey="conversions" 
            stackId="1" 
            stroke="#ffc658" 
            fill="rgba(255, 198, 88, 0.6)" 
            name="Conversions"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
