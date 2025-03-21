
import React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Metric = {
  value: string;
  label: string;
};

type MetricFilterProps = {
  metrics: Metric[];
  selectedMetrics: string[];
  onChange: (values: string[]) => void;
};

const MetricFilter: React.FC<MetricFilterProps> = ({
  metrics,
  selectedMetrics,
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleToggleMetric = (value: string) => {
    const isSelected = selectedMetrics.includes(value);
    
    if (isSelected) {
      // Don't allow deselecting all metrics
      if (selectedMetrics.length > 1) {
        onChange(selectedMetrics.filter(v => v !== value));
      }
    } else {
      onChange([...selectedMetrics, value]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-[200px]"
        >
          {selectedMetrics.length === metrics.length
            ? "All metrics"
            : `${selectedMetrics.length} selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search metrics..." className="h-9" />
          <CommandEmpty>No metrics found.</CommandEmpty>
          <CommandGroup>
            {metrics.map((metric) => (
              <CommandItem
                key={metric.value}
                value={metric.value}
                onSelect={() => handleToggleMetric(metric.value)}
              >
                <div 
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    selectedMetrics.includes(metric.value) 
                      ? "bg-primary text-primary-foreground" 
                      : "opacity-50"
                  )}
                >
                  {selectedMetrics.includes(metric.value) && (
                    <CheckIcon className="h-3 w-3" />
                  )}
                </div>
                <span>{metric.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MetricFilter;
