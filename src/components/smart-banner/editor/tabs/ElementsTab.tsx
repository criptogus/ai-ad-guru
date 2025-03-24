
import React, { useState } from "react";
import { BannerElement } from "@/hooks/smart-banner/types";
import ElementList from "../../ElementList";
import ElementProperties from "../ElementProperties";
import { Layers } from "lucide-react";

interface ElementsTabProps {
  bannerElements: BannerElement[];
  onUpdateBannerElements: (elements: BannerElement[]) => void;
}

const ElementsTab: React.FC<ElementsTabProps> = ({
  bannerElements,
  onUpdateBannerElements
}) => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  const selectedElement = selectedElementId 
    ? bannerElements.find(el => el.id === selectedElementId) 
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <ElementList 
          elements={bannerElements}
          onUpdateElements={onUpdateBannerElements}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
        />
      </div>
      <div>
        {selectedElement ? (
          <ElementProperties 
            element={selectedElement} 
            onUpdateElement={(property, value) => {
              const updatedElements = bannerElements.map(el => {
                if (el.id === selectedElementId) {
                  return { ...el, [property]: value };
                }
                return el;
              });
              onUpdateBannerElements(updatedElements);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full border rounded-md p-6">
            <div className="text-center text-muted-foreground">
              <Layers className="mx-auto h-12 w-12 opacity-20" />
              <p className="mt-2">Select an element to edit its properties</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElementsTab;
