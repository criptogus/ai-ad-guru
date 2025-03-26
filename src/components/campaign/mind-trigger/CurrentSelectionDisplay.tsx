
import React from "react";

interface CurrentSelectionDisplayProps {
  platform: string;
  selectedTrigger: string;
}

const CurrentSelectionDisplay: React.FC<CurrentSelectionDisplayProps> = ({
  platform,
  selectedTrigger,
}) => {
  if (!selectedTrigger) {
    return (
      <div className="mt-4">
        <h3 className="text-md font-medium mb-2">Current Selection</h3>
        <div className="p-3 bg-muted rounded-md">
          <p className="text-muted-foreground">No mind trigger selected for this platform yet</p>
        </div>
      </div>
    );
  }

  // Format the trigger display for better readability
  const formatTriggerDisplay = (trigger: string) => {
    // Handle custom triggers
    if (trigger.startsWith("custom:")) {
      return trigger.substring(7);
    }
    
    // Convert snake_case to Title Case for predefined triggers
    if (trigger.includes("_")) {
      return trigger
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    
    // Default fallback
    return trigger.charAt(0).toUpperCase() + trigger.slice(1);
  };

  // Get category name based on the trigger
  const getCategoryName = (trigger: string) => {
    if (trigger.startsWith("custom:")) return "Custom Prompt";
    
    const triggerMap: Record<string, string> = {
      // Google
      "urgency": "Urgency & Scarcity",
      "social_proof": "Social Proof",
      "problem_solution": "Problem-Solution",
      "curiosity": "Curiosity",
      "comparison": "Comparison",
      
      // Meta
      "lifestyle": "Lifestyle Aspiration",
      "before_after": "Before & After",
      "user_generated": "User Generated Content",
      "storytelling": "Storytelling",
      "tutorial": "Tutorial/How-to",
      
      // LinkedIn
      "thought_leadership": "Thought Leadership",
      "data_insights": "Data & Insights",
      "professional_growth": "Professional Growth",
      "industry_trends": "Industry Trends",
      "case_study": "Case Study",
      
      // Microsoft
      "specificity": "Specificity",
      "authority": "Authority",
      "emotional": "Emotional Appeal",
      "question": "Question Format",
      "benefit_driven": "Benefit-Driven"
    };
    
    return triggerMap[trigger] || "Custom Trigger";
  };

  return (
    <div className="mt-4">
      <h3 className="text-md font-medium mb-2">Current Selection</h3>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
        <div className="mb-2">
          <span className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded-full text-blue-800 dark:text-blue-200">
            {getCategoryName(selectedTrigger)}
          </span>
        </div>
        <p className="text-blue-800 dark:text-blue-300 font-medium mb-1">
          {formatTriggerDisplay(selectedTrigger)}
        </p>
        {selectedTrigger.startsWith("custom:") && (
          <p className="text-xs text-blue-600 dark:text-blue-400 italic">
            Custom trigger will be sent directly to our AI ad generation system
          </p>
        )}
      </div>
    </div>
  );
};

export default CurrentSelectionDisplay;
