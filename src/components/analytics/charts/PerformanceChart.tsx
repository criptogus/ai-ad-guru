
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent 
} from "@/components/ui/chart";

interface PerformanceData {
  day: string;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  metrics?: Array<"impressions" | "clicks" | "conversions">;
  height?: number;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ 
  data, 
  metrics = ["impressions", "clicks", "conversions"],
  height = 300
}) => {
  // Correct the config structure to match ChartConfig type
  const config = {
    impressions: {
      label: "Impressions",
      theme: { light: "#8884d8", dark: "#9c94ff" }
    },
    clicks: {
      label: "Clicks",
      theme: { light: "#82ca9d", dark: "#6EE7B7" }
    },
    conversions: {
      label: "Conversions",
      theme: { light: "#ffc658", dark: "#FFB86C" }
    }
  };

  const getMetricColor = (metric: string) => {
    const metricConfig = config[metric as keyof typeof config];
    // Use appropriate theme color based on current theme
    return metricConfig?.theme?.light || "#8884d8";
  };

  return (
    <div className="h-[300px]" style={{ height: `${height}px` }}>
      <ChartContainer
        config={config}
        className="h-full w-full"
      >
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey="day" 
            stroke="var(--muted-foreground)" 
            fontSize={12} 
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis 
            stroke="var(--muted-foreground)" 
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          />
          <ChartTooltip
            content={({ active, payload }) => (
              <ChartTooltipContent
                active={active}
                payload={payload}
              />
            )}
          />
          <ChartLegend
            content={({ payload }) => (
              <ChartLegendContent payload={payload} />
            )}
          />
          
          {metrics.includes("impressions") && (
            <Area 
              type="monotone" 
              dataKey="impressions" 
              stroke={getMetricColor("impressions")} 
              fill={`${getMetricColor("impressions")}80`} 
              name="impressions"
            />
          )}
          
          {metrics.includes("clicks") && (
            <Area 
              type="monotone" 
              dataKey="clicks" 
              stroke={getMetricColor("clicks")} 
              fill={`${getMetricColor("clicks")}80`} 
              name="clicks"
            />
          )}
          
          {metrics.includes("conversions") && (
            <Area 
              type="monotone" 
              dataKey="conversions" 
              stroke={getMetricColor("conversions")} 
              fill={`${getMetricColor("conversions")}80`} 
              name="conversions"
            />
          )}
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default PerformanceChart;
