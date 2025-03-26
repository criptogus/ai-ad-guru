
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  setActiveCategory
}) => {
  return (
    <div className="mb-8">
      <ScrollArea className="w-full pb-4">
        <div className="flex gap-3 pb-2">
          <Button
            variant={activeCategory === "all" ? "secondary" : "outline"}
            size="sm"
            className="text-xs whitespace-nowrap"
            onClick={() => setActiveCategory("all")}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            All Templates
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "secondary" : "outline"}
              size="sm"
              className="text-xs whitespace-nowrap"
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="mr-1.5">{category.emoji}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;
