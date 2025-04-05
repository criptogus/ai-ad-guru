
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronRight } from "lucide-react";

export interface TriggerGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTrigger: (trigger: string) => void;
  platform?: string;
  buttonText?: string;
}

const TriggerGallery: React.FC<TriggerGalleryProps> = ({
  open,
  onOpenChange,
  onSelectTrigger,
  platform = "google",
  buttonText = "Add Mind Trigger"
}) => {
  // Mental triggers based on platform
  const triggers = {
    google: [
      "Limited Time Offer",
      "Save 50% Today",
      "Free Shipping",
      "Get Started Now",
      "Learn More",
      "Fast Results",
      "Money-Back Guarantee",
      "Exclusive Access",
      "Best-Seller",
      "New Arrival",
      "Top Rated",
      "24/7 Support",
      "No Hidden Fees",
      "Premium Quality",
      "Customer Favorite",
      "Award-Winning",
      "Secure Checkout",
      "Expert Approved"
    ],
    meta: [
      "Limited Collection",
      "Shop Now, Pay Later",
      "Handcrafted Quality",
      "Ethically Sourced",
      "Limited Edition",
      "Trending Now",
      "Custom Made For You",
      "Free Returns",
      "Join The Community",
      "Discover More",
      "Behind The Scenes",
      "As Seen On Instagram",
      "Customer Stories"
    ],
    linkedin: [
      "Industry Leader",
      "Professional Network",
      "Career Growth",
      "Expert Insights",
      "Certified Professional",
      "Join Our Team",
      "Business Solutions",
      "Trusted Partner",
      "Strategic Advantage",
      "Professional Development",
      "Industry Recognition",
      "Exclusive Webinar",
      "Limited Seats"
    ]
  };

  const currentTriggers = triggers[platform as keyof typeof triggers] || triggers.google;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {currentTriggers.map((trigger, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="justify-start text-xs h-auto py-1 px-2"
            onClick={() => onSelectTrigger(trigger)}
          >
            {trigger}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TriggerGallery;
