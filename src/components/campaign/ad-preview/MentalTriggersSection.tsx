
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Crown, 
  Sparkles, 
  Users, 
  Lock, 
  Heart,
  Hourglass,
  Radar,
  MessagesSquare,
  Award,
  ListChecks,
  Percent
} from "lucide-react";
import { useMentalTriggers } from "@/hooks/useMentalTriggers";
import TriggerGallery from "./TriggerGallery";

const triggerIcons: Record<string, React.ReactNode> = {
  urgency: <Clock className="h-4 w-4" />,
  authority: <Crown className="h-4 w-4" />,
  curiosity: <Sparkles className="h-4 w-4" />,
  social_proof: <Users className="h-4 w-4" />,
  scarcity: <Hourglass className="h-4 w-4" />,
  exclusivity: <Lock className="h-4 w-4" />,
  emotion: <Heart className="h-4 w-4" />,
  novelty: <Radar className="h-4 w-4" />,
  user_generated: <MessagesSquare className="h-4 w-4" />,
  credibility: <Award className="h-4 w-4" />,
  value: <ListChecks className="h-4 w-4" />,
  discount: <Percent className="h-4 w-4" />
};

interface MentalTriggersSectionProps {
  onSelectTrigger: (trigger: string, platform: string) => void;
  activePlatform: string;
}

const MentalTriggersSection: React.FC<MentalTriggersSectionProps> = ({ 
  onSelectTrigger,
  activePlatform,
}) => {
  const { triggers, getActiveTrigger } = useMentalTriggers();
  const activeTrigger = getActiveTrigger(activePlatform);

  const handleSelectTrigger = (trigger: string) => {
    onSelectTrigger(trigger, activePlatform);
  };

  const getTriggerDisplayName = (trigger: string): string => {
    return trigger
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Mental Triggers
          {activeTrigger && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 px-3 py-1 flex items-center gap-1">
              {triggerIcons[activeTrigger] || <Sparkles className="h-4 w-4" />}
              <span>
                {getTriggerDisplayName(activeTrigger)}
              </span>
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select a mental trigger to customize your ad's psychological impact. The trigger will be applied to the ads for the selected platform.
          </p>
          
          <TriggerGallery 
            triggers={triggers}
            activeTrigger={activeTrigger}
            onSelectTrigger={handleSelectTrigger}
            triggerIcons={triggerIcons}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MentalTriggersSection;
