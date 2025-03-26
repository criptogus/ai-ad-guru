
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MindTriggerSelectionStepProps {
  selectedPlatforms: string[];
  selectedTriggers: Record<string, string>;
  onTriggersChange: (triggers: Record<string, string>) => void;
  onBack: () => void;
  onNext: () => void;
}

const MindTriggerSelectionStep: React.FC<MindTriggerSelectionStepProps> = ({
  selectedPlatforms,
  selectedTriggers,
  onTriggersChange,
  onBack,
  onNext,
}) => {
  const [activeTab, setActiveTab] = useState(selectedPlatforms[0] || "google");
  const [customTrigger, setCustomTrigger] = useState("");

  // Common mind triggers
  const mindTriggers = {
    google: [
      { id: "urgency", name: "Urgency", description: "Create a sense of limited time or scarcity" },
      { id: "social_proof", name: "Social Proof", description: "Highlight popularity or testimonials" },
      { id: "problem_solution", name: "Problem-Solution", description: "Present a problem, then offer your solution" },
      { id: "curiosity", name: "Curiosity", description: "Create intrigue with incomplete information" },
      { id: "comparison", name: "Comparison", description: "Compare your offering to alternatives" },
    ],
    meta: [
      { id: "lifestyle", name: "Lifestyle Aspiration", description: "Show the desired lifestyle your product enables" },
      { id: "before_after", name: "Before & After", description: "Demonstrate transformation and results" },
      { id: "user_generated", name: "User Generated Content", description: "Authentic content from real customers" },
      { id: "storytelling", name: "Storytelling", description: "Narrative that connects emotionally" },
      { id: "tutorial", name: "Tutorial/How-to", description: "Demonstrate product value through instruction" },
    ],
    linkedin: [
      { id: "thought_leadership", name: "Thought Leadership", description: "Position as an industry expert" },
      { id: "data_insights", name: "Data & Insights", description: "Share valuable business intelligence" },
      { id: "professional_growth", name: "Professional Growth", description: "Help advance careers or businesses" },
      { id: "industry_trends", name: "Industry Trends", description: "Highlight emerging opportunities" },
      { id: "case_study", name: "Case Study", description: "Show real-world business results" },
    ],
    microsoft: [
      { id: "specificity", name: "Specificity", description: "Use precise numbers and details" },
      { id: "authority", name: "Authority", description: "Establish expertise and credibility" },
      { id: "emotional", name: "Emotional Appeal", description: "Connect on an emotional level" },
      { id: "question", name: "Question Format", description: "Pose a question to engage the reader" },
      { id: "benefit_driven", name: "Benefit-Driven", description: "Focus on specific benefits to the user" },
    ],
  };

  // Platform-specific template examples
  const templates = {
    google: [
      "Discover [Benefit] | [Unique Feature] | [Call to Action]",
      "[Problem]? Get [Solution] Today | [Timeframe] Results",
      "[Discount]% Off [Product] | Limited Time | [USP]",
    ],
    meta: [
      "Transform your [pain point] with our [product] 🔥",
      "How [customer name] achieved [result] using [product] ✨",
      "The secret to [desired outcome] revealed! 👀",
    ],
    linkedin: [
      "New Report: [Industry] Trends That Will Shape [Year]",
      "How [Company] Increased [Metric] by [Percentage] in [Timeframe]",
      "[Number]+ Professionals Trust Our [Solution] for [Benefit]",
    ],
    microsoft: [
      "Looking for [Solution]? | [USP] | [Guarantee]",
      "[Question about Pain Point]? | [Solution] | [Social Proof]",
      "[Location] [Service] | [USP] | Free [Bonus]",
    ],
  };

  const handleSelectTrigger = (value: string) => {
    const updatedTriggers = { ...selectedTriggers };
    updatedTriggers[activeTab] = value;
    onTriggersChange(updatedTriggers);
  };

  const handleAddCustomTrigger = () => {
    if (customTrigger.trim()) {
      const updatedTriggers = { ...selectedTriggers };
      updatedTriggers[activeTab] = customTrigger.trim();
      onTriggersChange(updatedTriggers);
      setCustomTrigger("");
    }
  };

  const getCurrentPlatformName = (id: string) => {
    switch(id) {
      case "google": return "Google Ads";
      case "meta": return "Instagram/Meta Ads";
      case "linkedin": return "LinkedIn Ads";
      case "microsoft": return "Microsoft Ads";
      default: return id.charAt(0).toUpperCase() + id.slice(1);
    }
  };

  const getPlatformTriggers = (platformId: string) => {
    return mindTriggers[platformId as keyof typeof mindTriggers] || mindTriggers.google;
  };

  const getPlatformTemplates = (platformId: string) => {
    return templates[platformId as keyof typeof templates] || templates.google;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Mind Triggers & Templates</CardTitle>
        <CardDescription>
          Mind triggers are psychological concepts that make your ads more effective and persuasive
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid" style={{ gridTemplateColumns: `repeat(${selectedPlatforms.length}, 1fr)` }}>
            {selectedPlatforms.map(platform => (
              <TabsTrigger key={platform} value={platform}>
                {getCurrentPlatformName(platform)}
              </TabsTrigger>
            ))}
          </TabsList>

          {selectedPlatforms.map(platform => (
            <TabsContent key={platform} value={platform} className="space-y-4">
              <div>
                <h3 className="text-md font-medium mb-2">Select a Mind Trigger</h3>
                <Select value={selectedTriggers[platform] || ""} onValueChange={handleSelectTrigger}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a psychological trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    {getPlatformTriggers(platform).map(trigger => (
                      <SelectItem key={trigger.id} value={trigger.id}>
                        {trigger.name} - {trigger.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Or create a custom trigger/prompt</h4>
                  <div className="flex gap-2">
                    <Input 
                      value={customTrigger}
                      onChange={(e) => setCustomTrigger(e.target.value)}
                      placeholder="Enter a custom trigger or prompt instruction"
                    />
                    <Button onClick={handleAddCustomTrigger} type="button" variant="secondary">
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">Template Examples</h3>
                <div className="bg-muted p-3 rounded-md space-y-2">
                  {getPlatformTemplates(platform).map((template, idx) => (
                    <div 
                      key={idx} 
                      className="p-2 bg-background rounded border cursor-pointer hover:border-primary transition-colors"
                      onClick={() => {
                        setCustomTrigger(template);
                      }}
                    >
                      {template}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Click any template to use it as your custom prompt
                </p>
              </div>

              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">Current Selection</h3>
                {selectedTriggers[platform] ? (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <p className="text-blue-800 dark:text-blue-300">
                      {selectedTriggers[platform].startsWith("custom:") 
                        ? selectedTriggers[platform].substring(7) 
                        : getPlatformTriggers(platform).find(t => t.id === selectedTriggers[platform])?.description || selectedTriggers[platform]}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-muted-foreground">No mind trigger selected for this platform yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="pt-6 mt-6 border-t flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            onClick={onNext}
            disabled={selectedPlatforms.some(platform => !selectedTriggers[platform])}
          >
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MindTriggerSelectionStep;
