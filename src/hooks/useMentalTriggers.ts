
import { useState } from "react";

export function useMentalTriggers() {
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);

  const insertTrigger = (
    triggerText: string,
    fieldName: string,
    currentValue: string,
    onUpdate: (field: string, value: string) => void
  ) => {
    // If there's existing text, append the trigger with line breaks
    const updatedValue = currentValue 
      ? `${triggerText} ${currentValue}` 
      : triggerText;
    
    onUpdate(fieldName, updatedValue);
    setSelectedTrigger(triggerText);
  };

  const getTriggers = () => {
    return [
      "Limited Time Offer",
      "Exclusive Deal",
      "Save Up To 50%",
      "Free Shipping",
      "Buy Now",
      "Act Fast",
      "New Arrival",
      "Best Seller",
      "Sale Ends Soon",
      "Join Now",
      "Don't Miss Out",
      "Special Promotion",
      "Today Only",
      "Last Chance",
      "Get Started",
      "Sign Up Today"
    ];
  };

  return {
    selectedTrigger,
    setSelectedTrigger,
    insertTrigger,
    getTriggers
  };
}
