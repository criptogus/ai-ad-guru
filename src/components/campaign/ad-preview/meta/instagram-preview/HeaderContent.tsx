
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderContentProps {
  companyName: string;
}

const HeaderContent: React.FC<HeaderContentProps> = ({ companyName }) => {
  return (
    <div className="flex items-center p-2 border-b">
      <Avatar className="h-8 w-8 mr-2">
        <AvatarFallback>{companyName.charAt(0)}</AvatarFallback>
        <AvatarImage src="" />
      </Avatar>
      <div>
        <p className="text-sm font-semibold">{companyName}</p>
        <p className="text-xs text-gray-500">Sponsored</p>
      </div>
      <div className="ml-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal">
          <circle cx="12" cy="12" r="1"/>
          <circle cx="19" cy="12" r="1"/>
          <circle cx="5" cy="12" r="1"/>
        </svg>
      </div>
    </div>
  );
};

export default HeaderContent;
