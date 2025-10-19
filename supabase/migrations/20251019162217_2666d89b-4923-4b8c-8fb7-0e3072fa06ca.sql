-- Enable RLS on existing tables that don't have it
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graph_edges ENABLE ROW LEVEL SECURITY;

-- Create public access policies for these tables since they're used for temporary analysis
-- Users can read all articles
CREATE POLICY "Public can view all articles" 
ON public.articles 
FOR SELECT 
USING (true);

-- Users can read all claims
CREATE POLICY "Public can view all claims" 
ON public.claims 
FOR SELECT 
USING (true);

-- Users can read all citations
CREATE POLICY "Public can view all citations" 
ON public.citations 
FOR SELECT 
USING (true);

-- Users can read all sources
CREATE POLICY "Public can view all sources" 
ON public.sources 
FOR SELECT 
USING (true);

-- Users can read all metrics
CREATE POLICY "Public can view all metrics" 
ON public.metrics 
FOR SELECT 
USING (true);

-- Users can read all graph edges
CREATE POLICY "Public can view all graph_edges" 
ON public.graph_edges 
FOR SELECT 
USING (true);