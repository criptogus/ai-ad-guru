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

async function checkCache(url: string, platform: string) {
  try {
    const { data, error } = await supabase
      .from('audience_analysis_cache')
      .select('*')
      .eq('url', url)
      .eq('platform', platform)
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      console.error('Cache check error:', error);
      return null;
    }

    if (data) {
      const createdAt = new Date(data.created_at);
      const now = new Date();
      const daysDiff = (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);

      if (daysDiff <= 30) {
        console.log('Cache hit for URL:', url, 'platform:', platform);
        return {
          fromCache: true,
          data: data.analysis_result,
          cachedAt: data.created_at
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error checking cache:', error);
    return null;
  }
}

async function saveToCache(url: string, platform: string, analysisResult: any) {
  try {
    const { error } = await supabase
      .from('audience_analysis_cache')
      .upsert({
        url,
        platform,
        analysis_result: analysisResult,
        updated_at: new Date().toISOString(),
        status: 'active',
        version: 1
      });

    if (error) {
      console.error('Cache save error:', error);
    } else {
      console.log('Successfully cached analysis for URL:', url, 'platform:', platform);
    }
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
}

function getLocalizedPrompt(language: string, websiteData: any): string {
  // Portuguese prompt
  if (language === 'pt' || language === 'pt-BR' || language === 'pt-PT') {
    return `
    Você é um analista sênior de Marketing e Novos Negócios com vasta experiência em análise de mercado e público-alvo.

    Baseado nas informações da empresa abaixo, forneça uma análise detalhada, objetiva e baseada em fatos. NÃO INVENTE informações que não estejam presentes nos dados fornecidos.

    Informações da empresa:
    Nome: ${websiteData.companyName}
    Descrição: ${websiteData.businessDescription}
    Diferenciais: ${websiteData.uniqueSellingPoints?.join(', ')}
    Palavras-chave: ${websiteData.keywords?.join(', ')}

    Por favor, forneça uma análise estruturada com os seguintes pontos:

    1. PERFIL DO PÚBLICO-ALVO DETALHADO
    - Faixa etária e distribuição por sexo
    - Profissões e cargos relevantes
    - Estilo de vida e hábitos
    - Preocupações e dores específicas
    - Grupos sociais e ambientes frequentados
    - Poder aquisitivo e comportamento de compra

    2. GEOLOCALIZAÇÃO ESTRATÉGICA
    - Regiões prioritárias
    - Características demográficas por região
    - Potencial de mercado por localidade

    3. ANÁLISE DE MERCADO
    - Oportunidades identificadas (Oceano Azul)
    - Áreas saturadas (Oceano Vermelho)
    - Tendências de crescimento
    - Nichos inexplorados ou subatendidos
    - Tamanho estimado do mercado (se possível identificar)

    4. ANÁLISE COMPETITIVA
    - Principais concorrentes no segmento
    - Diferenciais competitivos da empresa
    - Posicionamento dos concorrentes
    - Oportunidades vs concorrência
    - Ameaças do mercado

    Forneça a análise em português, com linguagem profissional mas acessível.
    `;
  }
  // English prompt
  else if (language === 'en' || language === 'en-US' || language === 'en-GB') {
    return `
    You are a senior Marketing and Business Development analyst with extensive experience in market and target audience analysis.

    Based on the company information below, provide a detailed, objective and fact-based analysis. DO NOT INVENT information not present in the provided data.

    Company Information:
    Name: ${websiteData.companyName}
    Description: ${websiteData.businessDescription}
    Unique Selling Points: ${websiteData.uniqueSellingPoints?.join(', ')}
    Keywords: ${websiteData.keywords?.join(', ')}

    Please provide a structured analysis with the following points:

    1. DETAILED TARGET AUDIENCE PROFILE
    - Age range and gender distribution
    - Relevant professions and positions
    - Lifestyle and habits
    - Specific concerns and pain points
    - Social groups and frequented environments
    - Purchasing power and buying behavior

    2. STRATEGIC GEOLOCATION
    - Priority regions
    - Demographic characteristics by region
    - Market potential by location

    3. MARKET ANALYSIS
    - Identified opportunities (Blue Ocean)
    - Saturated areas (Red Ocean)
    - Growth trends
    - Unexplored or underserved niches
    - Estimated market size (if identifiable)

    4. COMPETITIVE ANALYSIS
    - Main competitors in the segment
    - Company's competitive advantages
    - Competitors' positioning
    - Opportunities vs competition
    - Market threats

    Provide the analysis in English, with professional but accessible language.
    `;
  }
  // Spanish prompt
  else if (language === 'es' || language === 'es-ES' || language === 'es-MX') {
    return `
    Eres un analista senior de Marketing y Desarrollo de Negocios con amplia experiencia en análisis de mercado y público objetivo.

    Basado en la información de la empresa a continuación, proporciona un análisis detallado, objetivo y basado en hechos. NO INVENTES información que no esté presente en los datos proporcionados.

    Información de la empresa:
    Nombre: ${websiteData.companyName}
    Descripción: ${websiteData.businessDescription}
    Puntos únicos de venta: ${websiteData.uniqueSellingPoints?.join(', ')}
    Palabras clave: ${websiteData.keywords?.join(', ')}

    Por favor, proporciona un análisis estructurado con los siguientes puntos:

    1. PERFIL DETALLADO DEL PÚBLICO OBJETIVO
    - Rango de edad y distribución por género
    - Profesiones y posiciones relevantes
    - Estilo de vida y hábitos
    - Preocupaciones y puntos de dolor específicos
    - Grupos sociales y ambientes frecuentados
    - Poder adquisitivo y comportamiento de compra

    2. GEOLOCALIZACIÓN ESTRATÉGICA
    - Regiones prioritarias
    - Características demográficas por región
    - Potencial de mercado por ubicación

    3. ANÁLISIS DE MERCADO
    - Oportunidades identificadas (Océano Azul)
    - Áreas saturadas (Océano Rojo)
    - Tendencias de crecimiento
    - Nichos inexplorados o desatendidos
    - Tamaño estimado del mercado (si es identificable)

    4. ANÁLISIS COMPETITIVO
    - Principales competidores en el segmento
    - Ventajas competitivas de la empresa
    - Posicionamiento de los competidores
    - Oportunidades vs competencia
    - Amenazas del mercado

    Proporciona el análisis en español, con lenguaje profesional pero accesible.
    `;
  }
  // Default to English if language not recognized
  return getLocalizedPrompt('en', websiteData);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { websiteData, platform = 'all' } = await req.json();
    const detectedLanguage = websiteData.language || 'en';
    const websiteUrl = websiteData.websiteUrl || '';
    
    console.log('Analyzing audience with language:', detectedLanguage);
    console.log('Website data:', websiteData);
    
    // Check cache first
    const cacheResult = await checkCache(websiteUrl, platform);
    if (cacheResult) {
      return new Response(
        JSON.stringify({ 
          success: true,
          data: cacheResult.data,
          fromCache: true,
          cachedAt: cacheResult.cachedAt,
          language: detectedLanguage
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      );
    }
    
    const prompt = getLocalizedPrompt(detectedLanguage, websiteData);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a senior marketing and business development analyst. Respond in ${detectedLanguage}.`
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
    
    // Save to cache
    await saveToCache(websiteUrl, platform, analysis);

    return new Response(
      JSON.stringify({ 
        success: true,
        data: analysis,
        language: detectedLanguage,
        fromCache: false
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
