
import React from "react";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: { id: string; name: string; emoji: string }[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory("all")}
          className="rounded-full"
        >
          🔍 All Templates
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className="rounded-full"
          >
            <span className="mr-1.5">{category.emoji}</span>
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
