
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.6.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { websiteData } = await req.json();

    const prompt = `
    Você é um analista de marketing sênior especializado em publicidade digital. Com base nas informações abaixo, faça uma análise detalhada do público-alvo ideal para este negócio.

    Informações do negócio:
    Nome: ${websiteData.companyName}
    Descrição: ${websiteData.businessDescription}
    Diferenciais: ${websiteData.uniqueSellingPoints?.join(', ')}
    Palavras-chave: ${websiteData.keywords?.join(', ')}

    Por favor, forneça uma análise estruturada com:

    1. RESUMO DO PÚBLICO-ALVO:
    - Perfil demográfico (idade, localização, renda)
    - Interesses e características principais

    2. DORES E NECESSIDADES:
    - Principais problemas que buscam resolver
    - Objetivos e aspirações

    3. COMPORTAMENTOS:
    - Hábitos de consumo
    - Processo de decisão de compra
    - Canais de informação preferidos

    4. RECOMENDAÇÕES DE SEGMENTAÇÃO:
    - Nichos específicos
    - Oportunidades de microsegmentação
    - Critérios de targeting para anúncios

    5. CANAIS RECOMENDADOS:
    - Plataformas mais efetivas
    - Tipos de conteúdo que mais engajam
    - Momentos ideais para abordar

    Forneça a análise em português do Brasil, com linguagem profissional mas acessível.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um analista de marketing especializado em análise de público-alvo para campanhas digitais."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const analysis = completion.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        success: true,
        data: analysis
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
