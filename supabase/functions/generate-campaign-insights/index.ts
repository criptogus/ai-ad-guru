
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { OpenAI } from "https://esm.sh/openai@4.20.1";

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Handle preflight OPTIONS request
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API keys from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !openaiApiKey) {
      throw new Error('Missing required environment variables');
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey: openaiApiKey });
    
    // Initialize Supabase client with service role for admin privileges
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse the request body to get userId
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log(`Generating insights for user: ${userId}`);
    
    // 1. Fetch user's campaigns
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select(`
        id, 
        name,
        platform, 
        status,
        budget,
        budget_type,
        created_at,
        campaign_performance (
          impressions,
          clicks,
          ctr,
          spend
        )
      `)
      .eq('user_id', userId);
    
    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError);
      throw new Error(`Failed to fetch campaigns: ${campaignsError.message}`);
    }
    
    // If no campaigns found
    if (!campaigns || campaigns.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No campaigns found for analysis',
          insights: [] 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log(`Found ${campaigns.length} campaigns for analysis`);
    
    // 2. Transform campaign data for OpenAI
    const campaignData = campaigns.map(campaign => {
      const performance = campaign.campaign_performance && campaign.campaign_performance.length > 0 
        ? campaign.campaign_performance[0] 
        : { impressions: 0, clicks: 0, ctr: 0, spend: 0 };
      
      return {
        id: campaign.id,
        name: campaign.name,
        platform: campaign.platform,
        status: campaign.status,
        budget: campaign.budget,
        budget_type: campaign.budget_type,
        impressions: performance.impressions,
        clicks: performance.clicks,
        ctr: performance.ctr,
        spend: performance.spend,
        created_at: campaign.created_at
      };
    });
    
    // 3. Generate insights using OpenAI
    const prompt = `
      You are an AI marketing analyst specialized in digital advertising. Given the following campaign performance data, rank the campaigns from best to worst and provide actionable insights on how to improve lower-performing campaigns.

      📌 **Campaign Data:**
      ${JSON.stringify(campaignData, null, 2)}

      🎯 **Expected Output:**
      - Rank all campaigns from **highest to lowest performance**.
      - Provide **key insights** on why the top campaigns are successful.
      - Identify **issues in low-performing campaigns** and suggest **fixes**.
      - Suggest **budget adjustments** and **A/B testing strategies**.

      Return a JSON response in this format:
      {
        "ranked_campaigns": [
          { "campaign_id": "123", "name": "Campaign Name", "ranking": 1, "reason": "Best CTR and conversion rate", "category": "performance" },
          { "campaign_id": "456", "name": "Campaign Name", "ranking": 2, "reason": "High impressions, but low CTR", "category": "creative" },
          { "campaign_id": "789", "name": "Campaign Name", "ranking": 3, "reason": "Poor conversion rate, needs ad creative update", "category": "audience" }
        ],
        "insights": [
          { "campaign_id": "456", "title": "Improve Ad Creative", "description": "Your ad copy needs more compelling call-to-action elements.", "category": "creative" },
          { "campaign_id": "789", "title": "Budget Reallocation Needed", "description": "Increase budget for top performers, pause low ROI ads", "category": "budget" }
        ]
      }

      Category should be one of: "performance", "budget", "creative", "audience", or "technical".
      Keep insights action-oriented and specific. No more than 5 insights total.
    `;
    
    console.log('Sending prompt to OpenAI...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using the more capable model
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1200,
      temperature: 0.7,
    });
    
    if (!response.choices || response.choices.length === 0 || !response.choices[0].message.content) {
      throw new Error('OpenAI returned an invalid response');
    }
    
    console.log('Received response from OpenAI');
    
    // 4. Parse the OpenAI response
    let aiResponse;
    try {
      aiResponse = JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.log('Raw response:', response.choices[0].message.content);
      throw new Error('Failed to parse AI response');
    }
    
    // 5. Return the insights
    return new Response(
      JSON.stringify({
        ranked_campaigns: aiResponse.ranked_campaigns || [],
        insights: aiResponse.insights || []
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Error generating campaign insights:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
