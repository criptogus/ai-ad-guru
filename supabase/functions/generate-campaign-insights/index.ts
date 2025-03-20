
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
    
    // 3. Generate insights using OpenAI with enhanced prompt
    const prompt = `
      You are an advanced AI marketing analyst specialized in digital advertising. 
      Analyze the following campaign performance data, and provide detailed insights 
      and actionable recommendations to improve performance.

      📌 **Campaign Data:**
      ${JSON.stringify(campaignData, null, 2)}

      🎯 **Your Analysis Should Include:**
      1. Rank all campaigns from **highest to lowest performance** based on ROI, CTR, and efficiency.
      2. Identify **key performance trends** (improvements or declines).
      3. Detect **anomalies** in the campaign data that need attention.
      4. Provide **specific recommendations** for each underperforming campaign.
      5. Suggest **budget reallocations** to maximize returns.

      Return a JSON response in this format:
      {
        "ranked_campaigns": [
          { 
            "campaign_id": "123", 
            "name": "Campaign Name",
            "ranking": 1, 
            "reason": "Best CTR and conversion rate", 
            "category": "performance" 
          }
        ],
        "insights": [
          { 
            "campaign_id": "456", 
            "title": "Improve Ad Creative", 
            "description": "Your ad copy needs more compelling call-to-action elements.", 
            "category": "creative" 
          },
          { 
            "campaign_id": "789", 
            "title": "Budget Reallocation Needed", 
            "description": "Increase budget for top performers, pause low ROI ads", 
            "category": "budget" 
          },
          { 
            "campaign_id": "all", 
            "title": "Overall Performance Trend", 
            "description": "CTR has improved by 15% across all campaigns in the last week", 
            "category": "performance" 
          }
        ],
        "recommendations": [
          {
            "campaign_id": "456",
            "action": "Pause Campaign",
            "reason": "High CPC with low conversions",
            "priority": "high",
            "expected_impact": "Save $X in ad spend"
          },
          {
            "campaign_id": "123",
            "action": "Increase Budget",
            "reason": "Strong ROI, room for scaling",
            "priority": "medium",
            "expected_impact": "Potential 20% increase in conversions"
          },
          {
            "campaign_id": "789",
            "action": "A/B Test Headlines",
            "reason": "CTR below benchmark",
            "priority": "medium",
            "expected_impact": "Potential 15% increase in CTR"
          }
        ]
      }

      Categories should be one of: "performance", "budget", "creative", "audience", or "technical".
      For any insights related to all campaigns, use "all" as the campaign_id.
      Priority should be "high", "medium", or "low".
      Make all insights action-oriented, specific, and data-driven.
    `;
    
    console.log('Sending enhanced prompt to OpenAI...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using the more capable model
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
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
    
    // 5. Return the enhanced insights and recommendations
    return new Response(
      JSON.stringify({
        ranked_campaigns: aiResponse.ranked_campaigns || [],
        insights: aiResponse.insights || [],
        recommendations: aiResponse.recommendations || []
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
