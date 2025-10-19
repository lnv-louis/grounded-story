-- Create articles table
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  headline TEXT NOT NULL,
  topic TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create claims table
CREATE TABLE public.claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  claim_text TEXT NOT NULL,
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  position INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create sources table
CREATE TABLE public.sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  outlet_name TEXT NOT NULL,
  url TEXT NOT NULL,
  publish_date TIMESTAMPTZ,
  political_lean TEXT CHECK (political_lean IN ('left', 'center', 'right')),
  source_type TEXT CHECK (source_type IN ('primary', 'secondary', 'tertiary')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create citations table
CREATE TABLE public.citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES public.claims(id) ON DELETE CASCADE,
  source_id UUID REFERENCES public.sources(id) ON DELETE CASCADE,
  excerpt TEXT NOT NULL,
  rationale TEXT,
  page_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create graph_edges table for mindmap relationships
CREATE TABLE public.graph_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  source_node UUID REFERENCES public.sources(id) ON DELETE CASCADE,
  target_node UUID REFERENCES public.sources(id) ON DELETE CASCADE,
  edge_type TEXT CHECK (edge_type IN ('cites', 'derives_from', 'republishes', 'contradicts')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create metrics table
CREATE TABLE public.metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  transparency_score DECIMAL(3,2) CHECK (transparency_score >= 0 AND transparency_score <= 1),
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  spectrum_coverage TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_claims_article ON public.claims(article_id);
CREATE INDEX idx_sources_article ON public.sources(article_id);
CREATE INDEX idx_citations_claim ON public.citations(claim_id);
CREATE INDEX idx_citations_source ON public.citations(source_id);
CREATE INDEX idx_edges_article ON public.graph_edges(article_id);
CREATE INDEX idx_metrics_article ON public.metrics(article_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to articles table
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();