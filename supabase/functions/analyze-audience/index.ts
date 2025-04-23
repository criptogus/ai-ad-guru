
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

function getLocalizedPrompt(language: string, websiteData: any): Promise<string> {
  // Import the createAudienceAnalysisPrompt function
  return import('./promptCreator.ts').then(module => {
    return module.createAudienceAnalysisPrompt(websiteData, 'all', language);
  });
}

// Function to validate the OpenAI response
function validateAudienceAnalysis(text: string): boolean {
  if (!text || typeof text !== 'string' || text.length < 100) {
    return false;
  }
  
  // Convert to uppercase for case-insensitive matching
  const upperText = text.toUpperCase();
  
  // Define expected section headers in different languages
  const expectedSections = [
    // English
    ['PUBLIC TARGET PROFILE', 'TARGET AUDIENCE PROFILE', 'DETAILED TARGET AUDIENCE PROFILE'],
    ['GEOLOCATION ANALYSIS', 'STRATEGIC GEOLOCATION'],
    ['MARKET ANALYSIS'],
    ['COMPETITOR INSIGHTS', 'COMPETITIVE ANALYSIS'],
    
    // Portuguese
    ['PERFIL DO PÚBLICO-ALVO', 'PÚBLICO-ALVO DETALHADO'],
    ['ANÁLISE DE GEOLOCALIZAÇÃO', 'GEOLOCALIZAÇÃO ESTRATÉGICA'],
    ['ANÁLISE DE MERCADO'],
    ['INSIGHTS DOS CONCORRENTES', 'ANÁLISE COMPETITIVA'],
    
    // Spanish
    ['PERFIL DETALLADO DEL PÚBLICO OBJETIVO'],
    ['GEOLOCALIZACIÓN ESTRATÉGICA'],
    ['ANÁLISIS DE MERCADO'],
    ['ANÁLISIS COMPETITIVO']
  ];
  
  // Count how many section types are found
  let foundSections = 0;
  
  for (const sectionVariants of expectedSections) {
    if (sectionVariants.some(header => upperText.includes(header))) {
      foundSections++;
    }
  }
  
  // Valid if at least 2 of the 4 main section types are found
  return foundSections >= 2;
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
      console.log('Found cached result for', websiteUrl);
      
      // Validate that the cached result has the expected format
      if (validateAudienceAnalysis(cacheResult.data)) {
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
      } else {
        console.log('Cached data did not match expected format, generating new analysis');
      }
    }
    
    const prompt = await getLocalizedPrompt(detectedLanguage, websiteData);

    // Verify if we have enough company information to generate an analysis
    if (!websiteData.companyName || 
        (!websiteData.businessDescription && !websiteData.companyDescription)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Insufficient company data to perform analysis. Please provide company name and description.'
        }),
        { 
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Make sure the API key is defined
    if (!Deno.env.get('OPENAI_API_KEY')) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'OpenAI API key not configured. Please check your environment settings.'
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

    try {
      console.log('Sending request to OpenAI with prompt...');
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a senior marketing and business development analyst specializing in audience analysis. Respond in ${detectedLanguage}.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });
      
      const analysis = completion.choices[0].message.content;
      console.log('OpenAI response received. Length:', analysis?.length);
      
      // Validate the OpenAI response is structured correctly
      if (!validateAudienceAnalysis(analysis || '')) {
        console.error('OpenAI response validation failed. Response:', analysis?.substring(0, 200) + '...');
        return new Response(
          JSON.stringify({
            success: false,
            error: 'OpenAI response does not contain the required analysis sections. Please try again.'
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
      
      // Save to cache if valid
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
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: `OpenAI API error: ${openaiError.message || 'Unknown error with OpenAI API'}`
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
  } catch (error) {
    console.error('General error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: `Failed to analyze audience: ${error.message || 'Unknown error'}`
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
