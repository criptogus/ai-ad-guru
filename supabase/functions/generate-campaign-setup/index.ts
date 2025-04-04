
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.20.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
  if (!OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY is not configured in environment variables" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }

  try {
    const { analysisResult, platform, language = 'en' } = await req.json();
    
    console.log("Generating campaign setup data for:", platform);
    console.log("Using website analysis:", analysisResult);
    console.log("Using language:", language);
    
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    // Adjust system prompt based on language
    let systemPrompt = "";
    if (language === 'pt') {
      systemPrompt = `Você é um assistente especializado em marketing digital que ajuda os usuários a criar campanhas publicitárias eficazes.
Com base nas informações do site fornecidas, gere uma configuração completa de campanha para anúncios do ${platform}.`;
    } else if (language === 'es') {
      systemPrompt = `Eres un asistente experto en marketing digital que ayuda a los usuarios a crear campañas publicitarias efectivas.
Basado en la información del sitio web proporcionada, genera una configuración completa de campaña para anuncios de ${platform}.`;
    } else {
      systemPrompt = `You are an expert digital advertising assistant that helps users create effective ad campaigns.
Based on the provided website information, generate a complete campaign setup for ${platform} ads.`;
    }

    // Adjust user prompt based on language
    let userPrompt = "";
    if (language === 'pt') {
      userPrompt = `Por favor, crie uma configuração completa de campanha com base nessas informações:
    
Empresa: ${analysisResult.companyName}
Descrição: ${analysisResult.businessDescription}
Público-alvo: ${analysisResult.targetAudience}
Tom da marca: ${analysisResult.brandTone}
Palavras-chave: ${analysisResult.keywords.join(', ')}
Chamadas para ação: ${analysisResult.callToAction.join(', ')}
Pontos de venda exclusivos: ${analysisResult.uniqueSellingPoints.join(', ')}

Gere o seguinte:
1. Um nome criativo para a campanha
2. Uma descrição concisa da campanha
3. Uma descrição específica do público-alvo
4. Palavras-chave relevantes (separadas por vírgula)
5. Um orçamento diário razoável (entre R$100-R$500)
6. O objetivo de campanha mais apropriado (conscientização, consideração, conversão)
7. Uma data de início (a partir de amanhã)
8. Uma data de término (opcional, 30 dias a partir do início)
9. Uma frequência de otimização recomendada (diária, 3 dias, semanal ou manual)
10. País alvo principal para esta campanha
11. Idioma principal desta campanha

Formate sua resposta como um objeto JSON válido com estes campos:
{
  "name": "Nome da campanha",
  "description": "Descrição da campanha",
  "targetAudience": "Descrição do público-alvo",
  "keywords": "palavra-chave1, palavra-chave2, palavra-chave3",
  "budget": 250,
  "objective": "conversão",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "optimizationFrequency": "diária",
  "country": "Brasil",
  "language": "pt-BR"
}`;
    } else if (language === 'es') {
      userPrompt = `Por favor, crea una configuración completa de campaña basada en esta información:
    
Empresa: ${analysisResult.companyName}
Descripción: ${analysisResult.businessDescription}
Público objetivo: ${analysisResult.targetAudience}
Tono de marca: ${analysisResult.brandTone}
Palabras clave: ${analysisResult.keywords.join(', ')}
Llamadas a la acción: ${analysisResult.callToAction.join(', ')}
Puntos de venta únicos: ${analysisResult.uniqueSellingPoints.join(', ')}

Genera lo siguiente:
1. Un nombre creativo para la campaña
2. Una descripción concisa de la campaña
3. Una descripción específica del público objetivo
4. Palabras clave relevantes (separadas por comas)
5. Un presupuesto diario razonable (entre $20-$100 USD)
6. El objetivo de campaña más apropiado (conciencia, consideración, conversión)
7. Una fecha de inicio (a partir de mañana)
8. Una fecha de finalización (opcional, 30 días desde el inicio)
9. Una frecuencia de optimización recomendada (diaria, 3días, semanal o manual)
10. País objetivo principal para esta campaña
11. Idioma principal de esta campaña

Formatea tu respuesta como un objeto JSON válido con estos campos:
{
  "name": "Nombre de campaña",
  "description": "Descripción de campaña",
  "targetAudience": "Descripción del público objetivo",
  "keywords": "palabraclave1, palabraclave2, palabraclave3",
  "budget": 50,
  "objective": "conversión",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "optimizationFrequency": "diario",
  "country": "España",
  "language": "es-ES"
}`;
    } else {
      userPrompt = `Please create a complete campaign setup based on this information:
    
Company: ${analysisResult.companyName}
Description: ${analysisResult.businessDescription}
Target Audience: ${analysisResult.targetAudience}
Brand Tone: ${analysisResult.brandTone}
Keywords: ${analysisResult.keywords.join(', ')}
Call To Actions: ${analysisResult.callToAction.join(', ')}
Unique Selling Points: ${analysisResult.uniqueSellingPoints.join(', ')}

Generate the following:
1. A creative campaign name
2. A concise campaign description
3. A specific target audience description
4. Relevant keywords (comma separated)
5. A reasonable daily budget (between $20-$100)
6. The most appropriate campaign objective (awareness, consideration, conversion)
7. A start date (from tomorrow)
8. An end date (optional, 30 days from start)
9. A recommended optimization frequency (daily, 3days, weekly, or manual)
10. Primary target country for this campaign
11. Primary language of this campaign

Format your response as a valid JSON object with these fields:
{
  "name": "Campaign name",
  "description": "Campaign description",
  "targetAudience": "Target audience description",
  "keywords": "keyword1, keyword2, keyword3",
  "budget": 50,
  "objective": "conversion",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "optimizationFrequency": "daily",
  "country": "United States",
  "language": "en-US"
}`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
    });
    
    const content = response.choices[0].message.content;
    console.log("OpenAI response:", content);
    
    // Extract and parse the JSON from the response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      const data = JSON.parse(jsonString);
      
      // Ensure dates are in the correct format
      if (data.startDate) {
        // Ensure it's a valid date string
        data.startDate = new Date(data.startDate).toISOString();
      } else {
        // Set default start date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        data.startDate = tomorrow.toISOString();
      }
      
      if (data.endDate) {
        // Ensure it's a valid date string
        data.endDate = new Date(data.endDate).toISOString();
      } else {
        // Set default end date to 30 days from start
        const endDate = new Date(data.startDate);
        endDate.setDate(endDate.getDate() + 30);
        data.endDate = endDate.toISOString();
      }
      
      console.log("Parsed data:", data);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse AI response", 
          rawResponse: content 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error("Error in generate-campaign-setup function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
