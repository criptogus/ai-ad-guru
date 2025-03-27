import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { FormError } from "./FormError";

interface ScheduleTabProps {
  campaignData: any;
  handleDateChange: (name: string, value: Date | null) => void;
  handleSelectChange: (name: string, value: string) => void;
  errors: Record<string, string | null>;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({
  campaignData,
  handleDateChange,
  handleSelectChange,
  errors,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="startDate" className="flex items-center">
          Start Date <span className="text-red-500 ml-1">*</span>
        </Label>
        <DatePicker
          date={campaignData.startDate ? new Date(campaignData.startDate) : null}
          onSelect={(date) => handleDateChange("startDate", date)}
          className={errors.startDate ? "border-red-500" : ""}
        />
        <FormError error={errors.startDate} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">
          End Date (Optional)
        </Label>
        <DatePicker
          date={campaignData.endDate ? new Date(campaignData.endDate) : null}
          onSelect={(date) => handleDateChange("endDate", date)}
        />
        <p className="text-xs text-muted-foreground">
          Leave empty for ongoing campaigns
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="optimizationFrequency">
          AI Optimization Frequency
        </Label>
        <Select 
          value={campaignData.optimizationFrequency || "daily"} 
          onValueChange={(value) => handleSelectChange("optimizationFrequency", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily (10 credits)</SelectItem>
            <SelectItem value="3days">Every 3 Days (5 credits)</SelectItem>
            <SelectItem value="weekly">Weekly (2 credits)</SelectItem>
            <SelectItem value="manual">Manual Only (0 credits)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          How often should our AI analyze and optimize your campaign performance
        </p>
      </div>
    </div>
  );
};

export default ScheduleTab;
