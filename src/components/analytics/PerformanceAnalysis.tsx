
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PerformanceChart from "./charts/PerformanceChart";
import DateRangeSelector from "./filters/DateRangeSelector";
import MetricFilter from "./filters/MetricFilter";
import { generatePerformanceData } from "./data/mockData";
import { Filter } from "lucide-react";

type DateRange = {
  from: Date;
  to: Date;
};

const metricOptions = [
  { value: "impressions", label: "Impressions" },
  { value: "clicks", label: "Clicks" },
  { value: "conversions", label: "Conversions" },
];

const PerformanceAnalysis: React.FC = () => {
  // Initialize with the last 7 days
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  
  const [dateRange, setDateRange] = useState<DateRange>({
    from: sevenDaysAgo,
    to: today,
  });
  
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "impressions",
    "clicks",
    "conversions",
  ]);
  
  const [performanceData, setPerformanceData] = useState(generatePerformanceData(7));
  
  // Update data when date range changes
  useEffect(() => {
    const dayDiff = Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    setPerformanceData(generatePerformanceData(dayDiff + 1));
  }, [dateRange]);

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <CardTitle className="text-lg font-medium">Performance Analysis</CardTitle>
        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <MetricFilter
              metrics={metricOptions}
              selectedMetrics={selectedMetrics}
              onChange={setSelectedMetrics}
            />
          </div>
          <DateRangeSelector
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <PerformanceChart 
            data={performanceData} 
            metrics={selectedMetrics as Array<"impressions" | "clicks" | "conversions">}
            height={400}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceAnalysis;
