
// analyze-website edge function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";
import { CacheHandler } from "./cacheHandler.ts";
import { validateAnalysisResult, normalizeArrayFields } from "./utils.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize OpenAI and Cheerio modules
const cheerio = await import("https://esm.sh/cheerio@1.0.0-rc.12");
const OpenAI = await import("https://esm.sh/openai@4.8.0");

// Initialize OpenAI client with API key from environment
const openai = new OpenAI.OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY")
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  
  try {
    const { url, checkCacheOnly, userId } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: "URL is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );
    
    // Initialize cache handler
    const cacheHandler = new CacheHandler(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );
    
    // Check cache first
    const cacheResult = await cacheHandler.checkCache(url);
    
    // If only checking cache status, return that info
    if (checkCacheOnly) {
      return new Response(
        JSON.stringify({
          success: true,
          fromCache: cacheResult.fromCache,
          cachedAt: cacheResult.cachedAt,
          expiresAt: cacheResult.expiresAt,
          data: cacheResult.data
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // If we have cached data, return it
    if (cacheResult.fromCache) {
      console.log("Returning cached analysis for URL:", url);
      
      return new Response(
        JSON.stringify({
          success: true,
          fromCache: true,
          cachedAt: cacheResult.cachedAt,
          expiresAt: cacheResult.expiresAt,
          data: cacheResult.data
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Log credit usage for userId if provided
    if (userId && userId !== 'anonymous') {
      console.log("Recording credit usage for user:", userId);
      
      try {
        await supabaseClient
          .from('credit_logs')
          .insert([{
            user_id: userId,
            action: 'website_analysis',
            credits_used: 2,
            context: { url }
          }]);
      } catch (error) {
        console.error("Error logging credit usage:", error);
      }
    }
    
    console.log("Fetching and analyzing URL:", url);
    
    // Fetch website content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
    }
    
    const htmlContent = await response.text();
    
    // Use cheerio to parse the HTML
    const $ = cheerio.load(htmlContent);
    
    // Extract main content
    let contentText = "";
    
    // Try to extract from common content selectors
    const contentSelectors = ['main', 'article', '#content', '.content', '#main', '.main'];
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        contentText += element.text() + " ";
      }
    }
    
    // If no content found from selectors, extract all visible body text
    if (contentText.trim() === "") {
      // Remove scripts, styles, and comments
      $('script, style, noscript, iframe, img').remove();
      contentText = $('body').text();
    }
    
    // Extract metadata
    const metaTitle = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    
    // Extract h1, h2, h3 tags for additional context
    const headings = [];
    $('h1, h2, h3').each((_, el) => {
      const headingText = $(el).text().trim();
      if (headingText) {
        headings.push(headingText);
      }
    });
    
    // Clean up the text
    contentText = contentText.replace(/\s+/g, ' ').trim();

    // Detect language first
    console.log("Detecting language of website content...");
    const languageDetectionPrompt = `
      You are a language detection system. Analyze the following website content and determine the primary language used.
      
      Website title: ${metaTitle}
      Website description: ${metaDescription}
      Content sample: ${contentText.substring(0, 500)}
      
      Respond with ONLY the ISO language code (e.g., "en", "pt", "es", "fr", etc.).
      Do not include any explanation or additional text.
    `;
    
    const languageDetection = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a language detection system. Respond with ONLY the ISO language code (e.g., 'en', 'pt', 'es', 'fr') without any explanation."
        },
        {
          role: "user",
          content: languageDetectionPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 10
    });
    
    const detectedLanguage = languageDetection.choices[0].message.content.trim().toLowerCase();
    console.log("Detected language:", detectedLanguage);
    
    // Prepare the data for analysis
    const websiteData = {
      title: metaTitle,
      description: metaDescription,
      headings: headings.slice(0, 10).join(' | '), // Limit to first 10 headings
      content: contentText.substring(0, 5000) // Limit content to 5000 chars
    };
    
    console.log("Extracted website data:", {
      title: websiteData.title,
      descriptionLength: websiteData.description.length,
      headingsCount: headings.length,
      contentLength: websiteData.content.length
    });
    
    // Define standard industry categories to guide the AI
    const standardIndustries = [
      "Education", "Healthcare", "Technology", "Finance", "Retail", 
      "Manufacturing", "Marketing", "Real Estate", "Travel", "Food & Beverage",
      "Consulting", "Entertainment", "Energy", "Agriculture", "Arts",
      "Automotive", "Media", "Pharmaceuticals", "Telecommunications", "Transportation",
      "Professional Services", "Non-Profit", "Government", "Sports", "Fitness",
      "Beauty", "Fashion"
    ].join(", ");
    
    // Create language-specific prompts
    let systemPrompt = "";
    
    if (detectedLanguage === "pt") {
      systemPrompt = `Você é uma IA especializada em analisar sites e extrair informações de negócios. Responda apenas com o formato JSON solicitado.
      Ao identificar a categoria da indústria, você DEVE escolher uma desta lista padrão: ${standardIndustries}.
      NÃO use adjetivos descritivos ou qualidades para o campo da indústria.
      Por exemplo, use "Education" não "Educational" ou "Professional Education".
      Use "Healthcare" não "Health Services" ou "Medical Care".
      Responda em português do Brasil.`;
    } else if (detectedLanguage === "es") {
      systemPrompt = `Eres una IA especializada en analizar sitios web y extraer información empresarial. Responde solo con el formato JSON solicitado.
      Al identificar la categoría de la industria, DEBES elegir una de esta lista estándar: ${standardIndustries}.
      NO uses adjetivos descriptivos o cualidades para el campo de la industria.
      Por ejemplo, usa "Education" no "Educational" o "Professional Education".
      Usa "Healthcare" no "Health Services" o "Medical Care".
      Responde en español.`;
    } else {
      systemPrompt = `You are an AI specialized in analyzing websites and extracting business information. Respond only with the requested JSON format.
      When identifying the industry category, you MUST choose one from this standard industry list: ${standardIndustries}.
      DO NOT use descriptive adjectives or qualities for the industry field.
      For example, use "Education" not "Educational" or "Professional Education".
      Use "Healthcare" not "Health Services" or "Medical Care".`;
    }
    
    // Create language-specific prompt text
    let promptText = "";
    
    if (detectedLanguage === "pt") {
      promptText = `
        Analise o conteúdo do site a seguir e extraia:
        1. Nome da Empresa
        2. Descrição da Empresa/Negócio (um parágrafo conciso)
        3. Público-Alvo
        4. Tom da Marca (ex: profissional, casual, luxuoso)
        5. Palavras-chave (5-10 palavras-chave relevantes)
        6. Frases de Chamada para Ação (2-4 frases)
        7. Pontos Únicos de Venda (3-5 pontos)
        8. Categoria da indústria - Você DEVE selecionar desta lista padrão:
           ${standardIndustries}
        
        IMPORTANTE: Para o campo da indústria, escolha APENAS UMA categoria da lista acima.
        NÃO use termos descritivos como "profissional" ou "inspirador" para o campo da indústria.
        Por exemplo, se for um site escolar, use "Education" e não "Educational" ou "Professional".
        Se for um site de saúde, use "Healthcare" e não "Health Services" ou "Medical Care".
        
        Título do Site: ${websiteData.title}
        Descrição do Site: ${websiteData.description}
        Cabeçalhos: ${websiteData.headings}
        
        Conteúdo do Site:
        ${websiteData.content}
        
        Formate sua resposta como JSON com estas chaves exatas:
        {
          "companyName": "",
          "companyDescription": "",
          "businessDescription": "",
          "targetAudience": "",
          "brandTone": "",
          "keywords": [],
          "callToAction": [],
          "uniqueSellingPoints": [],
          "industry": "",
          "language": "${detectedLanguage}"
        }
        
        Se você não conseguir determinar algo, faça uma estimativa educada com base no conteúdo disponível.
        Para o campo "industry", use APENAS o nome da categoria padrão da lista fornecida.
        Não inclua explicações, apenas o objeto JSON.
        Responda no idioma principal do conteúdo do site.
      `;
    } else if (detectedLanguage === "es") {
      promptText = `
        Analiza el siguiente contenido del sitio web y extrae:
        1. Nombre de la Empresa
        2. Descripción de la Empresa/Negocio (un párrafo conciso)
        3. Público Objetivo
        4. Tono de la Marca (ej: profesional, casual, lujoso)
        5. Palabras Clave (5-10 palabras clave relevantes)
        6. Frases de Llamada a la Acción (2-4 frases)
        7. Puntos Únicos de Venta (3-5 puntos)
        8. Categoría de industria - DEBES seleccionar de esta lista estándar:
           ${standardIndustries}
        
        IMPORTANTE: Para el campo de industria, elige SOLO UNA categoría de la lista anterior.
        NO uses términos descriptivos como "profesional" o "inspirador" para el campo de industria.
        Por ejemplo, si es un sitio web escolar, usa "Education" no "Educational" o "Professional".
        Si es un sitio web de salud, usa "Healthcare" no "Health Services" o "Medical Care".
        
        Título del Sitio Web: ${websiteData.title}
        Descripción del Sitio Web: ${websiteData.description}
        Encabezados: ${websiteData.headings}
        
        Contenido del Sitio Web:
        ${websiteData.content}
        
        Formatea tu respuesta como JSON con estas claves exactas:
        {
          "companyName": "",
          "companyDescription": "",
          "businessDescription": "",
          "targetAudience": "",
          "brandTone": "",
          "keywords": [],
          "callToAction": [],
          "uniqueSellingPoints": [],
          "industry": "",
          "language": "${detectedLanguage}"
        }
        
        Si no puedes determinar algo, haz una suposición educada basada en el contenido disponible.
        Para el campo "industry", usa SOLO un nombre de categoría estándar de la lista proporcionada.
        No incluyas explicaciones, solo el objeto JSON.
        Responde en el idioma principal del contenido del sitio web.
      `;
    } else {
      promptText = `
        Analyze the following website content and extract:
        1. Company Name
        2. Company/Business Description (a concise paragraph)
        3. Target Audience
        4. Brand Tone (e.g. professional, casual, luxurious)
        5. Keywords (5-10 relevant keywords)
        6. Call to Action phrases (2-4 phrases)
        7. Unique Selling Points (3-5 points)
        8. Industry category - You MUST select from this standard list of industries:
           ${standardIndustries}
        
        IMPORTANT: For the industry field, ONLY choose ONE standard industry category name from the list above.
        DO NOT use descriptive terms like "professional" or "inspirational" for the industry field.
        For example, if it's a school website, use "Education" not "Educational" or "Professional".
        If it's a healthcare website, use "Healthcare" not "Health Services" or "Medical Care".
        
        Website Title: ${websiteData.title}
        Website Description: ${websiteData.description}
        Headings: ${websiteData.headings}
        
        Website Content:
        ${websiteData.content}
        
        Format your response as JSON with these exact keys:
        {
          "companyName": "",
          "companyDescription": "",
          "businessDescription": "",
          "targetAudience": "",
          "brandTone": "",
          "keywords": [],
          "callToAction": [],
          "uniqueSellingPoints": [],
          "industry": "",
          "language": "${detectedLanguage}"
        }
        
        If you can't determine something, make an educated guess based on the available content.
        For the "industry" field, ONLY use a standard industry category name from the list provided.
        Do not include explanations, just the JSON object.
        Respond in the primary language of the website content.
      `;
    }
    
    console.log("Calling OpenAI for website analysis...");
    
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: promptText }
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.2,
    });
    
    // Parse the response
    const analysisResult = JSON.parse(completion.choices[0].message.content);
    
    // Ensure the industry field is properly formatted and comes from the standard list
    if (!standardIndustries.toLowerCase().includes(analysisResult.industry.toLowerCase())) {
      console.log(`Invalid industry detected: "${analysisResult.industry}", setting to default`);
      const closestMatch = findClosestIndustry(analysisResult.industry, standardIndustries.split(", "));
      analysisResult.industry = closestMatch;
    }
    
    // Fill in websiteUrl field and ensure language is set
    analysisResult.websiteUrl = url;
    analysisResult.language = detectedLanguage;
    
    console.log("Analysis complete:", {
      companyName: analysisResult.companyName,
      industryDetected: analysisResult.industry,
      keywordsCount: analysisResult.keywords.length,
      language: analysisResult.language
    });
    
    // Cache the result
    await cacheHandler.cacheResult(url, analysisResult);
    
    // Return the analysis result
    return new Response(
      JSON.stringify({
        success: true,
        fromCache: false,
        data: analysisResult
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error analyzing website:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

// Helper function to find the closest industry from the standard list
function findClosestIndustry(input: string, industries: string[]): string {
  if (!input) return "Professional Services";
  
  const inputLower = input.toLowerCase();
  
  // Direct matches
  for (const industry of industries) {
    if (inputLower === industry.toLowerCase()) {
      return industry;
    }
  }
  
  // Partial matches
  for (const industry of industries) {
    if (inputLower.includes(industry.toLowerCase())) {
      return industry;
    }
  }
  
  // Common fallback mappings
  const fallbackMap: Record<string, string> = {
    "tech": "Technology", 
    "software": "Technology",
    "it": "Technology",
    "digital": "Technology",
    "bank": "Finance",
    "financial": "Finance",
    "insurance": "Finance",
    "hospital": "Healthcare",
    "medical": "Healthcare",
    "clinic": "Healthcare",
    "doctor": "Healthcare",
    "school": "Education",
    "university": "Education",
    "college": "Education",
    "training": "Education",
    "ecommerce": "Retail",
    "store": "Retail",
    "shop": "Retail",
    "marketing": "Marketing",
    "advertisement": "Marketing",
    "ads": "Marketing",
    "property": "Real Estate",
    "housing": "Real Estate",
    "travel": "Travel",
    "tourism": "Travel",
    "hotel": "Travel",
    "food": "Food & Beverage",
    "restaurant": "Food & Beverage",
    "consult": "Consulting",
    "advisor": "Consulting",
    "movie": "Entertainment",
    "game": "Entertainment",
    "music": "Entertainment",
    "oil": "Energy",
    "gas": "Energy",
    "power": "Energy",
    "electricity": "Energy",
    "farm": "Agriculture",
    "art": "Arts",
    "design": "Arts",
    "creative": "Arts",
    "car": "Automotive",
    "vehicle": "Automotive",
    "news": "Media",
    "publishing": "Media",
    "drug": "Pharmaceuticals",
    "medicine": "Pharmaceuticals",
    "telecom": "Telecommunications",
    "logistics": "Transportation",
    "shipping": "Transportation",
    "delivery": "Transportation",
    "legal": "Professional Services",
    "law": "Professional Services",
    "accounting": "Professional Services",
    "nonprofit": "Non-Profit",
    "charity": "Non-Profit",
    "government": "Government",
    "public": "Government",
    "sport": "Sports",
    "fitness": "Fitness",
    "gym": "Fitness",
    "beauty": "Beauty",
    "cosmetic": "Beauty",
    "fashion": "Fashion",
    "clothing": "Fashion",
    "apparel": "Fashion"
  };
  
  for (const [key, value] of Object.entries(fallbackMap)) {
    if (inputLower.includes(key)) {
      return value;
    }
  }
  
  // Default fallback if nothing matches
  return "Professional Services";
}
