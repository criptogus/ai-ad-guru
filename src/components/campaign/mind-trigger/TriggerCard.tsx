
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface TriggerProps {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

interface TriggerCardProps {
  trigger: TriggerProps;
  isSelected: boolean;
  onSelect: () => void;
}

const TriggerCard: React.FC<TriggerCardProps> = ({
  trigger,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect();
      }}
      type="button"
      className={`relative block w-full text-left rounded-xl p-4 border transition-all ${
        isSelected 
          ? 'border-primary bg-primary/5 ring-2 ring-primary shadow-md' 
          : 'border-border hover:border-primary/30 hover:bg-accent'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{trigger.icon || '🧠'}</span>
            <h3 className="font-medium">{trigger.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{trigger.description}</p>
        </div>
        
        {isSelected && (
          <Badge variant="outline" className="absolute top-2 right-2 bg-primary text-primary-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            Selected
          </Badge>
        )}
      </div>
    </button>
  );
};

export default TriggerCard;
