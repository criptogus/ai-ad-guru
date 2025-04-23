
import { Menu } from "lucide-react";
import React from "react";

export const MobileSidebarToggle = ({ onOpen }: { onOpen: () => void }) => (
  <button
    onClick={onOpen}
    className="p-2 text-gray-600 md:hidden fixed top-4 left-4 z-50 bg-white dark:bg-[#1A1F2C] rounded shadow"
  >
    <Menu className="w-5 h-5" />
  </button>
);

export default MobileSidebarToggle;
