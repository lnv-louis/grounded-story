import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');

    if (!PERPLEXITY_API_KEY) {
      console.error('PERPLEXITY_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing query:', query);

    // System prompt for multi-perspective analysis
    const systemPrompt = `You are a fact-checking AI that analyzes claims from multiple political perspectives.
For each query, you must:
1. Identify the main topic and key claims
2. Find sources from left, center, and right political perspectives
3. Classify each source as primary (original data/court docs), secondary (news analysis), or tertiary (opinion)
4. Extract specific citations with page numbers or timestamps
5. Identify relationships between sources (cites, derives_from, republishes, contradicts)
6. Calculate transparency and confidence scores (0-1)

Return ONLY valid JSON matching this exact schema:
{
  "topic": "string",
  "headline": "string",
  "claims": [
    {
      "claim_text": "string",
      "confidence": 0.85,
      "position": 1
    }
  ],
  "sources": [
    {
      "outlet_name": "string",
      "url": "string",
      "publish_date": "2025-01-01T00:00:00Z",
      "political_lean": "left|center|right",
      "source_type": "primary|secondary|tertiary"
    }
  ],
  "citations": [
    {
      "claim_index": 0,
      "source_index": 0,
      "excerpt": "string",
      "rationale": "string",
      "page_number": "string"
    }
  ],
  "edges": [
    {
      "source_index": 0,
      "target_index": 1,
      "edge_type": "cites|derives_from|republishes|contradicts"
    }
  ],
  "metrics": {
    "transparency_score": 0.90,
    "confidence_score": 0.85,
    "spectrum_coverage": "full"
  }
}`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        temperature: 0.2,
        top_p: 0.9,
        search_domain_filter: [],
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze query', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Perplexity response received');

    const content = data.choices[0].message.content;
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    let analysisData;
    try {
      analysisData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError, jsonStr);
      return new Response(
        JSON.stringify({ error: 'Invalid response format from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(analysisData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-query function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
