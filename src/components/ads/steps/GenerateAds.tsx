import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { generateAds } from "@/services/ads/generationService";
import { Loading } from "@/components/ui/loading";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCredits } from "@/contexts/CreditsContext";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  companyName: z.string().min(2, "Nome da empresa é obrigatório"),
  websiteUrl: z.string().url("URL inválida"),
  companyDescription: z.string().optional(),
  objective: z.string().optional(),
  targetAudience: z.string().optional(),
  brandTone: z.string().optional(),
  platforms: z.array(z.string()).min(1, "Selecione pelo menos uma plataforma")
});

type FormValues = z.infer<typeof formSchema>;

interface GenerateAdsProps {
  onNext: (ads: Record<string, any[]>, data: FormValues) => void;
}

export const GenerateAds: React.FC<GenerateAdsProps> = ({ onNext }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { credits, deductCredits } = useCredits();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      websiteUrl: "",
      companyDescription: "",
      objective: "awareness",
      targetAudience: "",
      brandTone: "professional",
      platforms: ["google"]
    }
  });

  const selectedPlatforms = form.watch("platforms");

  const handleSelectionChange = (platform: string) => {
    const currentPlatforms = form.getValues("platforms") || [];
    
    if (currentPlatforms.includes(platform)) {
      form.setValue("platforms", currentPlatforms.filter(p => p !== platform));
    } else {
      form.setValue("platforms", [...currentPlatforms, platform]);
    }
  };

  const calculateCreditCost = () => {
    const platforms = form.getValues("platforms") || [];
    return platforms.length * 5; // 5 credits per platform
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const creditCost = calculateCreditCost();
      
      if (credits < creditCost) {
        toast.error("Créditos insuficientes", {
          description: `Você precisa de ${creditCost} créditos para gerar anúncios para as plataformas selecionadas.`
        });
        return;
      }
      
      setIsGenerating(true);

      const generationData: import("@/services/ads/generationService").AdGenerationParams = {
        ...values,
        companyName: values.companyName || "Default Company Name",
        websiteUrl: values.websiteUrl || "https://example.com",
        companyDescription: values.companyDescription || "",
        objective: values.objective || "awareness",
        targetAudience: values.targetAudience || "",
        brandTone: values.brandTone || "professional",
        platforms: values.platforms && values.platforms.length > 0
          ? values.platforms
          : ["google"]
      };
      
      const generatedAds = await generateAds(generationData);

      await deductCredits(creditCost);

      toast.success("Anúncios gerados com sucesso!", {
        description: `Foram gastos ${creditCost} créditos.`
      });

      onNext(generatedAds, values);
    } catch (error) {
      console.error("Error generating ads:", error);
      toast.error("Erro ao gerar anúncios", {
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6">Gerar Anúncios</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="advanced">Configurações Avançadas</TabsTrigger>
                <TabsTrigger value="platforms">Plataformas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Zero Digital Agency" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemplo.com.br" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="companyDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição da Empresa</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva sua empresa, produtos ou serviços..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4">
                <FormField
                  control={form.control}
                  name="objective"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivo</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um objetivo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="awareness">Aumentar Visibilidade</SelectItem>
                          <SelectItem value="consideration">Consideração</SelectItem>
                          <SelectItem value="conversion">Conversão</SelectItem>
                          <SelectItem value="traffic">Tráfego para o Site</SelectItem>
                          <SelectItem value="leads">Geração de Leads</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Público-Alvo</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva seu público-alvo ideal..." 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="brandTone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tom de Comunicação</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um tom" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="professional">Profissional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="friendly">Amigável</SelectItem>
                          <SelectItem value="humorous">Humorístico</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="technical">Técnico</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="platforms" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 mb-2">
                    <Label className="text-base font-medium">Selecione as Plataformas</Label>
                    <p className="text-sm text-muted-foreground">
                      Cada plataforma consome 5 créditos para geração.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex items-start space-x-3">
                    <Checkbox 
                      id="platform-google" 
                      checked={selectedPlatforms?.includes("google")}
                      onCheckedChange={() => handleSelectionChange("google")}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="platform-google" className="font-medium">Google Ads</Label>
                      <p className="text-xs text-muted-foreground">
                        Anúncios de texto para pesquisa Google
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex items-start space-x-3">
                    <Checkbox 
                      id="platform-meta" 
                      checked={selectedPlatforms?.includes("meta")}
                      onCheckedChange={() => handleSelectionChange("meta")}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="platform-meta" className="font-medium">Instagram Ads</Label>
                      <p className="text-xs text-muted-foreground">
                        Anúncios com imagem para Instagram
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex items-start space-x-3">
                    <Checkbox 
                      id="platform-linkedin" 
                      checked={selectedPlatforms?.includes("linkedin")}
                      onCheckedChange={() => handleSelectionChange("linkedin")}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="platform-linkedin" className="font-medium">LinkedIn Ads</Label>
                      <p className="text-xs text-muted-foreground">
                        Anúncios para LinkedIn
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex items-start space-x-3">
                    <Checkbox 
                      id="platform-microsoft" 
                      checked={selectedPlatforms?.includes("microsoft")}
                      onCheckedChange={() => handleSelectionChange("microsoft")}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="platform-microsoft" className="font-medium">Microsoft Ads</Label>
                      <p className="text-xs text-muted-foreground">
                        Anúncios de texto para Bing
                      </p>
                    </div>
                  </div>
                </div>
                
                {form.formState.errors.platforms && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.platforms.message}
                  </p>
                )}
                
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Custo total:</span>
                    <span className="font-bold">{calculateCreditCost()} créditos</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Saldo atual: {credits} créditos
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="pt-4 border-t flex justify-end">
              <Button 
                type="submit" 
                disabled={isGenerating || selectedPlatforms.length === 0}
                className="min-w-[140px]"
              >
                {isGenerating ? <Loading size="sm" /> : "Gerar Anúncios"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GenerateAds;
