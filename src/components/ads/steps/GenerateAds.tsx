
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// Mock function to simulate ad generation
const mockGenerateAds = async (data: any) => {
  // Simulate API call delay
  await new Promise(r => setTimeout(r, 2000));
  
  // Return mock data based on platforms selected
  const results: Record<string, any[]> = {};
  
  if (data.platforms.includes("google")) {
    results.google = Array(5).fill(null).map((_, i) => ({
      id: `google-${i}`,
      headline: `${data.companyName} - ${data.mainKeyword} #${i+1}`,
      description: `${data.description?.substring(0, 80) || "Descubra nossos produtos e serviços."} Visite nosso site hoje!`,
      url: data.websiteUrl,
      displayUrl: data.websiteUrl.replace(/^https?:\/\//, ''),
    }));
  }
  
  if (data.platforms.includes("meta")) {
    results.meta = Array(3).fill(null).map((_, i) => ({
      id: `meta-${i}`,
      headline: `${data.mainKeyword} - ${data.companyName}`,
      text: `${data.description?.substring(0, 100) || "Conheça nossos produtos e serviços exclusivos."} #${data.mainKeyword.replace(/\s+/g, '')}`,
      url: data.websiteUrl,
      imageUrl: `https://picsum.photos/seed/${data.companyName.replace(/\s+/g, '')}${i}/600/600`,
    }));
  }
  
  if (data.platforms.includes("linkedin")) {
    results.linkedin = Array(2).fill(null).map((_, i) => ({
      id: `linkedin-${i}`,
      headline: `${data.companyName} - Soluções em ${data.mainKeyword}`,
      description: data.description?.substring(0, 150) || "Soluções profissionais para sua empresa.",
      url: data.websiteUrl,
    }));
  }
  
  if (data.platforms.includes("microsoft")) {
    results.microsoft = Array(3).fill(null).map((_, i) => ({
      id: `microsoft-${i}`,
      headline: `${data.companyName} | ${data.mainKeyword}`,
      description: `${data.description?.substring(0, 70) || "Soluções completas para suas necessidades."} Saiba mais.`,
      url: data.websiteUrl,
    }));
  }
  
  return results;
};

// Form schema for validation
const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "O nome da empresa deve ter pelo menos 2 caracteres.",
  }),
  websiteUrl: z.string().url({
    message: "URL inválida. Inclua http:// ou https://",
  }),
  mainKeyword: z.string().min(2, {
    message: "A palavra-chave principal deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().optional(),
  targetAudience: z.string().optional(),
  platforms: z.array(z.string()).min(1, {
    message: "Selecione pelo menos uma plataforma.",
  }),
});

interface GenerateAdsProps {
  onNext: (ads: Record<string, any[]>, formData: z.infer<typeof formSchema>) => void;
}

export const GenerateAds = ({ onNext }: GenerateAdsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      websiteUrl: "https://",
      mainKeyword: "",
      description: "",
      targetAudience: "",
      platforms: ["google"],
    },
  });

  const platformOptions = [
    { id: "google", label: "Google Ads" },
    { id: "meta", label: "Meta Ads (Facebook/Instagram)" },
    { id: "linkedin", label: "LinkedIn Ads" },
    { id: "microsoft", label: "Microsoft Ads" },
  ];

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    
    try {
      const results = await mockGenerateAds(data);
      
      toast({
        title: "Anúncios gerados com sucesso",
        description: `${Object.values(results).flat().length} anúncios foram criados para suas plataformas selecionadas.`,
      });
      
      onNext(results, data);
    } catch (error: any) {
      toast({
        title: "Erro ao gerar anúncios",
        description: error.message || "Ocorreu um erro ao gerar os anúncios. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Gerar Anúncios</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Exemplo: Empresa XYZ" {...field} />
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
                    <Input placeholder="https://www.seusite.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="mainKeyword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Palavra-chave Principal</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Marketing Digital, Consultoria, etc" {...field} />
                </FormControl>
                <FormDescription>
                  Palavra-chave principal para seus anúncios.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição do Negócio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva o que sua empresa faz, produtos/serviços oferecidos..." 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Uma breve descrição da sua empresa e o que ela oferece.
                </FormDescription>
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
                  <Input 
                    placeholder="Ex: Homens e mulheres, 25-45 anos, interessados em tecnologia" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Quem são as pessoas que você quer alcançar com seus anúncios?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="platforms"
            render={() => (
              <FormItem>
                <FormLabel>Plataformas</FormLabel>
                <div className="space-y-2">
                  {platformOptions.map((platform) => (
                    <FormField
                      key={platform.id}
                      control={form.control}
                      name="platforms"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={platform.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(platform.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, platform.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== platform.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {platform.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando anúncios...
              </>
            ) : (
              "Gerar Anúncios"
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
};
