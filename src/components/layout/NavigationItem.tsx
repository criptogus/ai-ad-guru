
import React from "react";
import { Button } from "@/components/ui/button";

interface NavigationItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

export const NavigationItem = ({ to, icon, label, active }: NavigationItemProps) => {
  return (
    <Button 
      asChild 
      variant="ghost" 
      className="data-[active=true]:bg-muted focus:bg-secondary justify-start w-full" 
      data-active={active ? "true" : undefined}
    >
      <a href={to} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none focus:shadow-sm">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm font-medium leading-none">{label}</span>
        </div>
      </a>
    </Button>
  );
};

export default NavigationItem;
