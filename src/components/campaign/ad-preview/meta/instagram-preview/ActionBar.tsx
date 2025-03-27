
import React from "react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";

const ActionBar: React.FC = () => {
  return (
    <div className="flex items-center justify-between pt-2 pb-1">
      <div className="flex items-center space-x-4">
        <button className="text-gray-900 dark:text-gray-100">
          <Heart className="h-6 w-6" />
        </button>
        <button className="text-gray-900 dark:text-gray-100">
          <MessageCircle className="h-6 w-6" />
        </button>
        <button className="text-gray-900 dark:text-gray-100">
          <Send className="h-6 w-6" />
        </button>
      </div>
      <button className="text-gray-900 dark:text-gray-100">
        <Bookmark className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ActionBar;
