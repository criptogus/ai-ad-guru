
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createOpenAIClient } from "./openai.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, language } = await req.json();
    const openai = createOpenAIClient(Deno.env.get('OPENAI_API_KEY') || '');

    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content: "Você é um redator publicitário sênior premiado em Cannes e especialista em growth hacking. Trabalha em uma agência criativa de alto padrão e domina estratégias para campanhas em Google Ads, Instagram, LinkedIn e Microsoft Ads. Sua missão é criar anúncios que convertem, respeitando as limitações de cada plataforma e usando gatilhos mentais, copywriting persuasivo e storytelling moderno."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Nenhum conteúdo gerado");
    }

    try {
      const parsedContent = JSON.parse(content);
      return new Response(
        JSON.stringify({ success: true, content: parsedContent }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error("Erro ao fazer parse do JSON:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Formato de resposta inválido",
          rawContent: content 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
  } catch (error) {
    console.error("Erro na geração de anúncios:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
