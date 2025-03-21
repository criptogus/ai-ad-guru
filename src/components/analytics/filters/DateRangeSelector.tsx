
import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DateRange = {
  from: Date;
  to: Date;
};

type DateRangeSelectorProps = {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
};

const predefinedRanges = [
  { label: "Last 7 days", value: "7days" },
  { label: "Last 30 days", value: "30days" },
  { label: "This month", value: "thisMonth" },
  { label: "Last month", value: "lastMonth" },
  { label: "Custom", value: "custom" },
];

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  dateRange,
  onDateRangeChange,
}) => {
  const [date, setDate] = React.useState<DateRange>(dateRange);
  const [predefinedRange, setPredefinedRange] = React.useState("7days");

  const handleDateRangeChange = (newDateRange: DateRange) => {
    setDate(newDateRange);
    onDateRangeChange(newDateRange);
  };

  const handlePredefinedRangeChange = (value: string) => {
    setPredefinedRange(value);
    
    const today = new Date();
    let from = new Date();
    let to = new Date();
    
    switch (value) {
      case "7days":
        from = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30days":
        from = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "thisMonth":
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "lastMonth":
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        to = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "custom":
        // Don't change the dates, just allow custom selection
        return;
    }
    
    handleDateRangeChange({ from, to });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <Select value={predefinedRange} onValueChange={handlePredefinedRangeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          {predefinedRanges.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal w-[130px]"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date.from ? (
                format(date.from, "PPP")
              ) : (
                <span>From date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date.from}
              onSelect={(day) =>
                day && handleDateRangeChange({ ...date, from: day })
              }
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal w-[130px]"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date.to ? (
                format(date.to, "PPP")
              ) : (
                <span>To date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date.to}
              onSelect={(day) =>
                day && handleDateRangeChange({ ...date, to: day })
              }
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangeSelector;
