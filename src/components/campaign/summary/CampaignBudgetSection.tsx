
import React from "react";

interface CampaignBudgetSectionProps {
  budget?: number;
  budgetType?: "daily" | "lifetime";
  startDate?: string;
  endDate?: string;
}

const CampaignBudgetSection: React.FC<CampaignBudgetSectionProps> = ({
  budget,
  budgetType,
  startDate,
  endDate,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Budget & Schedule</h3>
      <div className="space-y-2">
        {budget && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Budget:</span>
            <span className="font-medium">${budget} {budgetType}</span>
          </div>
        )}
        {startDate && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Start Date:</span>
            <span className="font-medium">{startDate}</span>
          </div>
        )}
        {endDate && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">End Date:</span>
            <span className="font-medium">{endDate}</span>
          </div>
        )}
        {!budget && !startDate && !endDate && (
          <p className="text-muted-foreground">No budget or schedule information available</p>
        )}
      </div>
    </div>
  );
};

export default CampaignBudgetSection;
