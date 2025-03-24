
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideBeaker } from "lucide-react";
import { Link } from "react-router-dom";

const InstaAdTestLink: React.FC = () => {
  return (
    <Link to="/test-ads">
      <Button variant="outline" className="flex items-center gap-2">
        <LucideBeaker className="h-4 w-4" />
        <span>Open Ad Testing Area</span>
      </Button>
    </Link>
  );
};

export default InstaAdTestLink;
