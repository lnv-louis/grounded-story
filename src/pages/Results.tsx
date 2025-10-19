import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { ClaimsList } from "@/components/ClaimsList";
import { SourceCard } from "@/components/SourceCard";
import { MindmapGraph } from "@/components/MindmapGraph";
import { MetricsCircles } from "@/components/MetricsCircles";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnalysisResult, GraphNode, GraphEdge } from "@/lib/types";
import { toast } from "sonner";
import logo from "@/assets/grounded-logo.png";
import { useState, useEffect } from "react";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result: AnalysisResult = location.state?.result;
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!result) {
      navigate("/");
      return;
    }

    // Animate sections appearing one by one
    const sections = ['metrics', 'headline', 'claims', 'sources', 'graph'];
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < sections.length) {
        setVisibleSections(prev => new Set([...prev, sections[index]]));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  // Build graph data - filter out empty sources
  const validSources = result.sources.filter(s => s.outlet_name && s.outlet_name.trim() !== '');
  
  const nodes: GraphNode[] = [
    { id: 'article', name: result.topic, type: 'article' },
    ...result.claims.map((claim, idx) => ({
      id: `claim-${idx}`,
      name: `Claim ${idx + 1}`,
      type: 'claim' as const,
    })),
    ...validSources.map((source, idx) => ({
      id: `source-${idx}`,
      name: source.outlet_name,
      type: 'source' as const,
      political_lean: source.political_lean,
      source_type: source.source_type,
    })),
  ];

  const edges: GraphEdge[] = [
    ...result.claims.map((_, idx) => ({
      source: 'article',
      target: `claim-${idx}`,
      type: 'cites' as const,
    })),
    ...result.citations.map(citation => ({
      source: `claim-${citation.claim_index}`,
      target: `source-${citation.source_index}`,
      type: 'cites' as const,
    })),
    ...result.edges.map(edge => ({
      source: `source-${edge.source_index}`,
      target: `source-${edge.target_index}`,
      type: edge.edge_type,
    })),
  ];

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4" />
            New Search
          </Button>
          <div className="flex items-center gap-3">
            <img src={logo} alt="Grounded" className="h-7 w-7" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Grounded Report
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2 hover:bg-primary/10 hover:border-primary/50"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-10">
        {/* Metrics - Show First */}
        <section 
          className={`transition-all duration-500 ${
            visibleSections.has('metrics') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          <h3 className="text-xl font-semibold mb-6">Analysis Metrics</h3>
          <MetricsCircles metrics={result.metrics} />
        </section>

        {/* Headline */}
        <section 
          className={`transition-all duration-500 ${
            visibleSections.has('headline') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold mb-2">{result.headline}</h2>
          <p className="text-muted-foreground">{result.topic}</p>
          {result.summary && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground font-medium mb-1">AI Summary</p>
              <p className="text-sm">{result.summary}</p>
            </div>
          )}
        </section>

        {/* Key Claims */}
        <section 
          className={`transition-all duration-500 ${
            visibleSections.has('claims') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">Key Claims</h3>
          <ClaimsList claims={result.claims} sources={validSources} />
        </section>

        {/* Two Column Layout - Source Tree & Sources */}
        <section 
          className={`transition-all duration-500 ${
            visibleSections.has('sources') || visibleSections.has('graph')
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Source Tree (Mindmap) */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Source Tree</h3>
              <MindmapGraph nodes={nodes} edges={edges} />
            </div>

            {/* Sources */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                Sources ({validSources.length})
              </h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {validSources.map((source, idx) => (
                  <SourceCard
                    key={idx}
                    source={source}
                    citations={result.citations
                      .filter(c => c.source_index === idx)
                      .map(c => ({
                        excerpt: c.excerpt,
                        rationale: c.rationale,
                        page_number: c.page_number,
                      }))}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Results;
