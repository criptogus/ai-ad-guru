
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PerformanceData {
  name: string;
  google: number;
  meta: number;
  microsoft: number;
}

const performanceData: PerformanceData[] = [
  { name: "Mon", google: 400, meta: 240, microsoft: 180 },
  { name: "Tue", google: 300, meta: 380, microsoft: 210 },
  { name: "Wed", google: 520, meta: 420, microsoft: 250 },
  { name: "Thu", google: 450, meta: 380, microsoft: 270 },
  { name: "Fri", google: 600, meta: 520, microsoft: 300 },
  { name: "Sat", google: 580, meta: 480, microsoft: 260 },
  { name: "Sun", google: 650, meta: 540, microsoft: 290 },
];

const conversionData: PerformanceData[] = [
  { name: "Mon", google: 10, meta: 15, microsoft: 8 },
  { name: "Tue", google: 12, meta: 18, microsoft: 9 },
  { name: "Wed", google: 15, meta: 20, microsoft: 11 },
  { name: "Thu", google: 14, meta: 17, microsoft: 10 },
  { name: "Fri", google: 17, meta: 22, microsoft: 13 },
  { name: "Sat", google: 16, meta: 21, microsoft: 12 },
  { name: "Sun", google: 19, meta: 24, microsoft: 14 },
];

const PerformanceAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Platform Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="clicks">
            <TabsList className="mb-4">
              <TabsTrigger value="clicks">Clicks</TabsTrigger>
              <TabsTrigger value="impressions">Impressions</TabsTrigger>
              <TabsTrigger value="conversions">Conversions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="clicks">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="google" stroke="#4285F4" strokeWidth={2} />
                    <Line type="monotone" dataKey="meta" stroke="#8A4ED2" strokeWidth={2} />
                    <Line type="monotone" dataKey="microsoft" stroke="#00A2ED" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="impressions">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="google" fill="#4285F4" />
                    <Bar dataKey="meta" fill="#8A4ED2" />
                    <Bar dataKey="microsoft" fill="#00A2ED" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="conversions">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={conversionData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="google" stroke="#4285F4" strokeWidth={2} />
                    <Line type="monotone" dataKey="meta" stroke="#8A4ED2" strokeWidth={2} />
                    <Line type="monotone" dataKey="microsoft" stroke="#00A2ED" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">CTR Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="google" stroke="#4285F4" strokeWidth={2} />
                  <Line type="monotone" dataKey="meta" stroke="#8A4ED2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Budget Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData.slice(0, 4)}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="google" fill="#4285F4" />
                  <Bar dataKey="meta" fill="#8A4ED2" />
                  <Bar dataKey="microsoft" fill="#00A2ED" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceAnalysis;
