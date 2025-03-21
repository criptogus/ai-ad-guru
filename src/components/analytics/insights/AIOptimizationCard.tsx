
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Brain, ArrowRight, LineChart, BarChart3, PieChart } from "lucide-react";
import { useAdOptimizer } from "@/hooks/useAdOptimizer";
import { type OptimizationGoal } from "@/hooks/useAdOptimizer";

interface AIOptimizationCardProps {
  campaignId?: string;
  platformType?: "google" | "meta" | "linkedin" | "microsoft";
}

const AIOptimizationCard: React.FC<AIOptimizationCardProps> = ({
  campaignId = "demo-campaign",
  platformType = "google"
}) => {
  const [frequency, setFrequency] = useState<string>("daily");
  const [optimizationGoal, setOptimizationGoal] = useState<OptimizationGoal>("increase_ctr");
  const [isScheduled, setIsScheduled] = useState(false);
  
  const handleScheduleOptimization = () => {
    setIsScheduled(true);
  };
  
  const getFrequencyCredits = () => {
    switch (frequency) {
      case "daily": return 10;
      case "3day": return 5;
      case "weekly": return 2;
      default: return 10;
    }
  };
  
  const getGoalText = () => {
    switch (optimizationGoal) {
      case "increase_ctr": return "Increasing Click-Through Rate";
      case "increase_conversions": return "Maximizing Conversions";
      case "reduce_cpa": return "Lowering Cost Per Acquisition";
      case "increase_engagement": return "Boosting Engagement";
      default: return "Optimizing Performance";
    }
  };
  
  const getGoalIcon = () => {
    switch (optimizationGoal) {
      case "increase_ctr": return <LineChart className="h-4 w-4 mr-2" />;
      case "increase_conversions": return <BarChart3 className="h-4 w-4 mr-2" />;
      case "reduce_cpa": return <PieChart className="h-4 w-4 mr-2" />;
      case "increase_engagement": return <BarChart3 className="h-4 w-4 mr-2" />;
      default: return <LineChart className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <Card className="border-purple-100 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Brain className="mr-2 h-5 w-5 text-purple-500" />
            Smart AI Optimization
          </CardTitle>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            {getFrequencyCredits()} credits
          </Badge>
        </div>
        <CardDescription>
          Schedule AI to automatically optimize your ads for better performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Optimization Frequency</label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily (10 credits)</SelectItem>
                <SelectItem value="3day">Every 3 days (5 credits)</SelectItem>
                <SelectItem value="weekly">Weekly (2 credits)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Optimization Goal</label>
            <Select 
              value={optimizationGoal} 
              onValueChange={(value) => setOptimizationGoal(value as OptimizationGoal)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="increase_ctr">Increase CTR</SelectItem>
                <SelectItem value="increase_conversions">Maximize Conversions</SelectItem>
                <SelectItem value="reduce_cpa">Lower CPA</SelectItem>
                <SelectItem value="increase_engagement">Boost Engagement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isScheduled ? (
          <div className="bg-green-50 border border-green-100 rounded-md p-4 text-sm">
            <h4 className="font-medium text-green-800 flex items-center">
              {getGoalIcon()}
              <span>{getGoalText()}</span>
            </h4>
            <p className="mt-1 text-green-700">
              AI will analyze and optimize your ads {frequency === "daily" ? "every day" : 
              frequency === "3day" ? "every 3 days" : "once a week"}.
            </p>
            <div className="mt-3">
              <p className="text-xs text-green-600">Next optimization scheduled for tomorrow at 2:00 AM</p>
            </div>
          </div>
        ) : (
          <div className="bg-purple-50 border border-purple-100 rounded-md p-4 text-sm">
            <h4 className="font-medium text-purple-800 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>How AI Optimization Works</span>
            </h4>
            <ul className="mt-2 space-y-2 text-purple-700">
              <li className="flex items-start">
                <span className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                <span>AI analyzes ad performance across all campaigns</span>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                <span>Pauses low-performing ads, boosts winners</span>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                <span>Generates new ad variations based on top performers</span>
              </li>
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isScheduled ? (
          <Button variant="outline" className="w-full" onClick={() => setIsScheduled(false)}>
            Modify Optimization Schedule
          </Button>
        ) : (
          <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600" onClick={handleScheduleOptimization}>
            Schedule AI Optimization <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AIOptimizationCard;
