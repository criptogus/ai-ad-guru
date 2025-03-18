
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Campaign } from "@/models/CampaignTypes";
import { Clock, Pause, Play, Plus, RefreshCw } from "lucide-react";

interface RecentActivityProps {
  campaigns: Campaign[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ campaigns }) => {
  // Mock activities based on campaigns
  const activities = campaigns.slice(0, 3).map((campaign, index) => {
    const types = ["created", "updated", "paused", "resumed"];
    const type = types[index % types.length];
    const date = new Date();
    date.setHours(date.getHours() - index * 5);
    
    return {
      id: index + 1,
      type,
      campaign: campaign.name,
      date,
      platform: campaign.platform
    };
  });

  // Add a fixed "generated" activity for demonstration
  activities.push({
    id: 4,
    type: "generated",
    campaign: "Summer Collection",
    date: new Date(Date.now() - 86400000), // Yesterday
    platform: "meta"
  });

  // Sort by most recent first
  activities.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <Card>
      <div className="p-4 border-b">
        <h2 className="font-bold flex items-center">
          <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
          Recent Activity
        </h2>
      </div>
      <CardContent className="p-0">
        <div className="divide-y">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
        <div className="p-3 text-center border-t">
          <button className="text-xs text-primary font-medium">
            View All Activity
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

interface ActivityItemProps {
  activity: {
    id: number;
    type: string;
    campaign: string;
    date: Date;
    platform: string;
  };
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getIcon = () => {
    switch (activity.type) {
      case "created":
        return <Plus className="h-4 w-4 text-green-500" />;
      case "updated":
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case "paused":
        return <Pause className="h-4 w-4 text-amber-500" />;
      case "resumed":
        return <Play className="h-4 w-4 text-green-500" />;
      case "generated":
        return <Plus className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMessage = () => {
    switch (activity.type) {
      case "created":
        return `Created new ${activity.platform} campaign`;
      case "updated":
        return `Updated campaign settings`;
      case "paused":
        return `Paused campaign`;
      case "resumed":
        return `Resumed campaign`;
      case "generated":
        return `Generated new ad creatives`;
      default:
        return `Modified campaign`;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const mins = Math.floor(diffInHours * 60);
      return `${mins} min${mins !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="p-3 hover:bg-muted/50 transition-colors">
      <div className="flex gap-3">
        <div className="mt-0.5 flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start">
            <div className="font-medium text-sm truncate">
              {getMessage()}
            </div>
            <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
              {formatTime(activity.date)}
            </div>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {activity.campaign}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
