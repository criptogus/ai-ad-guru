
import React from "react";
import { MoreHorizontal } from "lucide-react";

interface HeaderSectionProps {
  companyName: string;
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ 
  companyName, 
  showMenu, 
  setShowMenu 
}) => {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 flex items-center justify-center">
          {/* Profile image placeholder with first letter */}
          <div className="w-7 h-7 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center text-xs font-bold">
            {companyName.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="ml-2">
          <div className="text-sm font-semibold flex items-center">
            {companyName}
            <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">• Sponsored</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="focus:outline-none"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
        
        {showMenu && (
          <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 z-10 min-w-[150px] text-sm">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              Hide Ad
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              Report Ad
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              Why am I seeing this?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderSection;
