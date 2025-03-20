
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

const FAQContact: React.FC = () => {
  return (
    <Card className="mt-10 mb-10">
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">📢 Didn't find what you were looking for?</h3>
          <p className="mb-4">
            📩 Contact us at <span className="font-medium">contact@zerodigital.com</span> – we're happy to help! 🚀
          </p>
          <Link to="/contact">
            <Button className="mt-2">
              <Mail className="mr-2 h-4 w-4" /> Contact Support
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default FAQContact;
