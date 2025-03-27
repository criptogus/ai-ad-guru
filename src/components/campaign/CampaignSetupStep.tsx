
import React, { useState, useEffect } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

// Define schema for form validation
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Campaign name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Campaign description must be at least 10 characters.",
  }),
  objective: z.string().min(1, {
    message: "Please select a campaign objective.",
  }),
  budget: z
    .string()
    .min(1, { message: "Please enter a budget." })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Budget must be a positive number.",
    }),
  budgetType: z.enum(["daily", "lifetime"]),
  startDate: z.date({ required_error: "Please select a start date." }),
  endDate: z
    .date()
    .nullable()
    .optional()
    .refine(
      (date) => !date || date > new Date(),
      "End date must be in the future"
    ),
  targetAudience: z.string().min(10, {
    message: "Target audience must be at least 10 characters.",
  }),
  autoOptimize: z.boolean().default(true),
  optimizationFrequency: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const campaignObjectives = [
  { value: "awareness", label: "Brand Awareness" },
  { value: "consideration", label: "Consideration" },
  { value: "conversions", label: "Conversions" },
  { value: "traffic", label: "Website Traffic" },
  { value: "leads", label: "Lead Generation" },
  { value: "engagement", label: "Engagement" },
];

interface CampaignSetupStepProps {
  analysisResult: WebsiteAnalysisResult | null;
  campaignData: any;
  onUpdateCampaignData: (data: any) => void;
  onBack: () => void;
  onNext: () => void;
}

const CampaignSetupStep: React.FC<CampaignSetupStepProps> = ({
  analysisResult,
  campaignData,
  onUpdateCampaignData,
  onBack,
  onNext,
}) => {
  const [loading, setLoading] = useState(false);
  const [targetingRecommendations, setTargetingRecommendations] = useState<any>(null);
  const [targetingLoading, setTargetingLoading] = useState(false);
  const { toast } = useToast();

  // Setup form with default values from campaign data or analysis result
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: campaignData.name || "",
      description: campaignData.description || (analysisResult?.businessDescription || ""),
      objective: campaignData.objective || "",
      budget: campaignData.budget ? campaignData.budget.toString() : "",
      budgetType: campaignData.budgetType || "daily",
      startDate: campaignData.startDate ? new Date(campaignData.startDate) : new Date(),
      endDate: campaignData.endDate ? new Date(campaignData.endDate) : undefined,
      targetAudience: campaignData.targetAudience || (analysisResult?.targetAudience || ""),
      autoOptimize: campaignData.autoOptimize !== undefined ? campaignData.autoOptimize : true,
      optimizationFrequency: campaignData.optimizationFrequency || "daily",
    },
  });

  // Populate form with analysis results when available
  useEffect(() => {
    if (analysisResult && !campaignData.name) {
      // Only update if user hasn't already entered data
      form.setValue("description", analysisResult.businessDescription || "");
      form.setValue("targetAudience", analysisResult.targetAudience || "");
    }
  }, [analysisResult, form, campaignData.name]);

  const generateTargetingRecommendations = async () => {
    if (!analysisResult) return;

    try {
      setTargetingLoading(true);

      const { data, error } = await supabase.functions.invoke('generate-targeting', {
        body: {
          businessDescription: analysisResult.businessDescription,
          targetAudience: analysisResult.targetAudience,
          keywordsCount: 5
        }
      });

      if (error) {
        throw error;
      }

      setTargetingRecommendations(data);
      
      // Update target audience field with the generated recommendations
      if (data && data.interests) {
        const newTargetAudience = `${form.getValues("targetAudience") || analysisResult.targetAudience || ""}\n\nInterests: ${data.interests}`;
        form.setValue("targetAudience", newTargetAudience);
      }

      toast({
        title: "Targeting Recommendations Generated",
        description: "AI suggestions have been added to your campaign setup.",
      });
    } catch (error: any) {
      console.error("Error generating targeting recommendations:", error);
      toast({
        title: "Failed to Generate Recommendations",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setTargetingLoading(false);
    }
  };

  const onSubmit = (data: FormValues) => {
    setLoading(true);
    
    // Format data for submission
    const formattedData = {
      ...data,
      budget: parseFloat(data.budget),
      startDate: data.startDate.toISOString().split('T')[0],
      endDate: data.endDate ? data.endDate.toISOString().split('T')[0] : null,
    };
    
    // Update campaign data and move to next step
    onUpdateCampaignData(formattedData);
    setLoading(false);
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Setup</CardTitle>
        <CardDescription>
          Configure your campaign settings and targeting options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="info">Campaign Info</TabsTrigger>
            <TabsTrigger value="targeting">Targeting</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value="info" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter campaign name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your campaign"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="objective"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Objective</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an objective" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {campaignObjectives.map((objective) => (
                              <SelectItem
                                key={objective.value}
                                value={objective.value}
                              >
                                {objective.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              step="0.01"
                              placeholder="100.00"
                              {...field}
                            />
                          </FormControl>
                          <FormField
                            control={form.control}
                            name="budgetType"
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="daily">Daily</SelectItem>
                                  <SelectItem value="lifetime">Lifetime</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date (Optional)</FormLabel>
                        <DatePicker
                          date={field.value || undefined}
                          setDate={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="targeting" className="space-y-4">
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <div className="flex justify-between items-center mb-2">
                        <FormDescription>
                          Describe who should see your ads
                        </FormDescription>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateTargetingRecommendations}
                          disabled={targetingLoading || !analysisResult}
                        >
                          {targetingLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            "Generate AI Targeting"
                          )}
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your target audience"
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {targetingRecommendations && (
                  <div className="bg-muted p-4 rounded-md space-y-2">
                    <h3 className="font-medium">AI Targeting Recommendations</h3>
                    {targetingRecommendations.interests && (
                      <div>
                        <span className="font-medium text-sm">Interests: </span>
                        <span className="text-sm">{targetingRecommendations.interests}</span>
                      </div>
                    )}
                    {targetingRecommendations.locations && (
                      <div>
                        <span className="font-medium text-sm">Locations: </span>
                        <span className="text-sm">{targetingRecommendations.locations}</span>
                      </div>
                    )}
                    {targetingRecommendations.ageRange && (
                      <div>
                        <span className="font-medium text-sm">Age Range: </span>
                        <span className="text-sm">{targetingRecommendations.ageRange}</span>
                      </div>
                    )}
                    {targetingRecommendations.gender && (
                      <div>
                        <span className="font-medium text-sm">Gender: </span>
                        <span className="text-sm">{targetingRecommendations.gender === 'all' ? 'All Genders' : targetingRecommendations.gender}</span>
                      </div>
                    )}
                    {targetingRecommendations.language && (
                      <div>
                        <span className="font-medium text-sm">Language: </span>
                        <span className="text-sm">{targetingRecommendations.language}</span>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <FormField
                  control={form.control}
                  name="autoOptimize"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          AI Optimization
                        </FormLabel>
                        <FormDescription>
                          Automatically optimize your ads with AI
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("autoOptimize") && (
                  <FormField
                    control={form.control}
                    name="optimizationFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Optimization Frequency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">
                              Daily (10 credits)
                            </SelectItem>
                            <SelectItem value="3days">
                              Every 3 Days (5 credits)
                            </SelectItem>
                            <SelectItem value="weekly">
                              Weekly (2 credits)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose how often AI should optimize your campaigns
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </TabsContent>

              <div className="mt-6 pt-4 border-t flex justify-between">
                <Button
                  type="button"
                  onClick={onBack}
                  variant="outline"
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Next Step
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CampaignSetupStep;
