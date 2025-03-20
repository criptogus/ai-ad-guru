
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  text: string;
  author: string;
  position: string;
  company: string;
  stars?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  text, 
  author, 
  position, 
  company, 
  stars = 5 
}) => {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="flex mb-4">
          {[...Array(stars)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-gray-700 mb-4">{text}</p>
        <div className="mt-6">
          <p className="font-semibold">— {author}</p>
          <p className="text-sm text-gray-600">{position}, {company}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
