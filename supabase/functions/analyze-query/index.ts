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

    // Detect if input is a URL
    const isUrl = /^https?:\/\//i.test(query.trim());
    
    // Pre-prompt to generate analysis criteria
    const prePrompt = `INPUT TYPE DETECTION:
${isUrl ? 
`The user has provided a URL: ${query}
1. If it's a standard web page: Fetch and read the full article content, including headline, author, publication date, and body text.
2. If it's a social media post (Instagram, Twitter, etc.): Extract the image(s), caption/description, author information, and engagement metrics.
3. Use the actual content from the URL as the subject of analysis.` 
: 
`The user has provided text/topic: ${query}
Analyze this topic by searching for the most relevant recent articles and sources.`}

ANALYSIS REQUIREMENTS:
You must comprehensively analyze the content for factual accuracy, bias, and clickbait characteristics.`;

    // Enhanced system prompt with new metrics
    const systemPrompt = `You are an advanced fact-checking and media analysis AI that provides multi-perspective source verification.

CORE MISSION:
Trace every claim back to its original sources, evaluate credibility, detect bias and clickbait, and present findings with full transparency.

ANALYSIS FRAMEWORK:


1. CONTENT EXTRACTION & CLAIM IDENTIFICATION
   - CRITICAL: Extract claims ONLY about the article's main subject matter and content
   - DO NOT extract claims about the news sources themselves (e.g., "BBC is trustworthy")
   - DO NOT extract claims about fact-checking processes
   - ONLY extract claims that are factual assertions made IN the article content
   - Example: For an article about HIV drugs, claims should be about HIV drugs, NOT about BBC News
   - Identify the main topic and narrative framing
   - Use the EXACT headline from the article - DO NOT create your own headline
   - If the article headline is available, you MUST use it verbatim

2. SOURCE TRACING (Critical)
   - For EACH claim, find the original source(s)
   - Trace the information chain: "Claim → Article A → Report B → Organization C"
   - Classify sources as:
     * Primary: Original data, court documents, research papers, official statements
     * Secondary: News reporting with original reporting
     * Tertiary: Opinion pieces, aggregation, commentary
   - Find sources across the political spectrum (left, center, right)
   - Include publish dates and URLs

3. FACTUAL ACCURACY METRIC (0-100%)
   Calculate based on:
   - % of claims that can be traced to credible, verifiable sources
   - Quality of sources (primary > secondary > tertiary)
   - Consistency across independent sources
   - Presence of verifiable data, citations, official records
   
   Scoring:
   - 90-100%: Nearly all claims verified by primary sources
   - 70-89%: Most claims verified, mix of primary/secondary sources  
   - 50-69%: Some verification, reliance on secondary sources
   - 30-49%: Limited verification, few credible sources
   - 0-29%: Minimal or no credible sourcing

4. CLICKBAIT LEVEL METRIC (0-100%)
   Evaluate the headline and framing for:
   - Emotional manipulation (fear, outrage, curiosity gaps)
   - Exaggeration or hyperbole
   - Misleading framing vs. actual content
   - Sensationalism over substance
   - "You won't believe..." "Shocking..." patterns
   
   Scoring:
   - 0-20%: Straightforward, descriptive headline
   - 21-40%: Slightly sensational but mostly accurate
   - 41-60%: Noticeably exaggerated or emotional
   - 61-80%: Highly sensational, misleading framing
   - 81-100%: Pure clickbait, deceptive headline

5. BIAS LEVEL METRIC (0-100%)
   Assess partisan lean and agenda-driven framing:
   - Language choice (loaded words, framing)
   - Source selection (only citing aligned sources)
   - Omission of contrary perspectives
   - Emotional vs. neutral tone
   - Presentation of opinion as fact
   
   Scoring:
   - 0-20%: Balanced, neutral presentation
   - 21-40%: Slight lean, mostly fair
   - 41-60%: Clear bias, some balance attempts
   - 61-80%: Strong bias, minimal opposing views
   - 81-100%: Extreme bias, propaganda-like

6. POLITICAL SPECTRUM ANALYSIS
   ${isUrl ? 'ONLY if the content is political in nature,' : 'ONLY for political topics,'}
   provide spectrum_coverage showing distribution of sources across:
   - left: Progressive/liberal sources
   - center: Centrist/neutral sources  
   - right: Conservative sources

7. CONFIDENCE RATINGS
   For each claim, provide confidence (0-1) based on:
   - Source quality and independence
   - Corroboration across sources
   - Recency and relevance of evidence

REQUIRED JSON OUTPUT:
{
  "topic": "string - main subject",
  "headline": "string - MUST be the exact article headline if URL provided, otherwise create descriptive headline about the topic",
  "summary": "string - AI-written 2-3 sentence summary of sourcing quality and key findings",
  "claims": [
    {
      "claim_text": "string - ONLY factual claims from the article content itself, NOT about the sources or outlets",
      "confidence": 0.85,
      "confidence_explanation": "string - brief 1-2 sentence explanation of why this confidence level",
      "position": 1,
      "source_chain": "string - Format: 'Source Name (type) [url] → Source Name (type) [url]' e.g. 'The Guardian (secondary) [https://...] → YouGov report (primary) [https://...]'"
    }
  ],
  "sources": [
    {
      "outlet_name": "string",
      "url": "string",
      "publish_date": "2025-01-01T00:00:00Z",
      "political_lean": "left|center|right (optional, only for political content)",
      "source_type": "primary|secondary|tertiary",
      "category": "news outlet|government agency|research institution|individual|political party|etc",
      "image_url": "string (optional - relevant image from the source page)"
    }
  ],
  "citations": [
    {
      "claim_index": 0,
      "source_index": 0,
      "excerpt": "string - direct quote from source",
      "rationale": "string - why this source supports the claim",
      "page_number": "string - page/timestamp/section reference"
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
    "factual_accuracy": 85,
    "factual_accuracy_explanation": "string - brief explanation of the score",
    "clickbait_level": 30,
    "clickbait_explanation": "string - brief explanation of the score",
    "bias_level": 45,
    "bias_explanation": "string - brief explanation of the score",
    "transparency_score": 0.90,
    "transparency_explanation": "string - brief explanation of the score",
    "confidence_score": 0.85,
    "confidence_explanation": "string - brief explanation of the score",
    "spectrum_coverage": "full|partial|limited|none",
    "political_distribution": {
      "left": 3,
      "center": 2,
      "right": 2
    }
  }
}

CRITICAL RULES:
- Return ONLY valid JSON, no markdown code blocks
- Every claim must have traceable sources
- Provide the complete source chain for transparency
- Be objective in bias assessment (detect bias in any direction)
- ${isUrl ? 'Analyze the actual content from the provided URL' : 'Search for and analyze relevant content'}`;

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
          { role: 'user', content: `${prePrompt}\n\nINPUT: ${query}` }
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
