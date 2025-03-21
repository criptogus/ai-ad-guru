
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, ChevronUp, Type, Image, Square, Trash2, Copy } from "lucide-react";
import { BannerElement } from "@/hooks/smart-banner/useBannerEditor";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from "uuid";

interface ElementListProps {
  elements: BannerElement[];
  onUpdateElements: (elements: BannerElement[]) => void;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
}

const ElementList: React.FC<ElementListProps> = ({
  elements,
  onUpdateElements,
  selectedElementId,
  onSelectElement
}) => {
  // Move element up in the list (decrease z-index)
  const moveElementUp = (id: string) => {
    const elementIndex = elements.findIndex(el => el.id === id);
    if (elementIndex > 0) {
      const newElements = [...elements];
      const temp = newElements[elementIndex];
      newElements[elementIndex] = newElements[elementIndex - 1];
      newElements[elementIndex - 1] = temp;
      
      // Update z-index values
      newElements.forEach((el, idx) => {
        el.zIndex = newElements.length - idx;
      });
      
      onUpdateElements(newElements);
    }
  };

  // Move element down in the list (increase z-index)
  const moveElementDown = (id: string) => {
    const elementIndex = elements.findIndex(el => el.id === id);
    if (elementIndex < elements.length - 1) {
      const newElements = [...elements];
      const temp = newElements[elementIndex];
      newElements[elementIndex] = newElements[elementIndex + 1];
      newElements[elementIndex + 1] = temp;
      
      // Update z-index values
      newElements.forEach((el, idx) => {
        el.zIndex = newElements.length - idx;
      });
      
      onUpdateElements(newElements);
    }
  };

  // Delete an element
  const deleteElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    onUpdateElements(newElements);
    if (selectedElementId === id) {
      onSelectElement(null);
    }
  };

  // Duplicate an element
  const duplicateElement = (id: string) => {
    const elementToDuplicate = elements.find(el => el.id === id);
    if (elementToDuplicate) {
      const newElement = {
        ...elementToDuplicate,
        id: uuidv4(),
        x: elementToDuplicate.x + 5,
        y: elementToDuplicate.y + 5
      };
      onUpdateElements([...elements, newElement]);
    }
  };

  // Get icon for element type
  const getElementIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type size={16} />;
      case "logo":
        return <Image size={16} />;
      case "shape":
        return <Square size={16} />;
      default:
        return <Type size={16} />;
    }
  };

  // Get label for element content
  const getElementLabel = (element: BannerElement) => {
    if (element.type === "text") {
      return element.content.length > 20
        ? element.content.substring(0, 20) + "..."
        : element.content;
    }
    return element.type.charAt(0).toUpperCase() + element.type.slice(1);
  };

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-base">Layer Elements</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {elements.map((element, index) => (
            <div
              key={element.id}
              className={`flex items-center justify-between p-2.5 hover:bg-gray-50 cursor-pointer ${
                selectedElementId === element.id ? "bg-blue-50" : ""
              }`}
              onClick={() => onSelectElement(element.id)}
            >
              <div className="flex items-center gap-2">
                {selectedElementId === element.id && (
                  <Check size={14} className="text-blue-500" />
                )}
                <div className="flex items-center gap-1.5">
                  {getElementIcon(element.type)}
                  <span className="text-sm font-medium">{getElementLabel(element)}</span>
                </div>
                <Badge variant="outline" className="h-5 text-xs">
                  {element.type}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveElementUp(element.id);
                  }}
                  disabled={index === 0}
                >
                  <ChevronUp size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveElementDown(element.id);
                  }}
                  disabled={index === elements.length - 1}
                >
                  <ChevronDown size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateElement(element.id);
                  }}
                >
                  <Copy size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteElement(element.id);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ElementList;
