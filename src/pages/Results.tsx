import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { SpectrumBar } from "@/components/SpectrumBar";
import { ClaimsList } from "@/components/ClaimsList";
import { SourceCard } from "@/components/SourceCard";
import { MindmapGraph } from "@/components/MindmapGraph";
import { MetricsDisplay } from "@/components/MetricsDisplay";
import { AnalysisResult, GraphNode, GraphEdge } from "@/lib/types";
import { toast } from "sonner";
import logo from "@/assets/grounded-logo.png";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result: AnalysisResult = location.state?.result;

  if (!result) {
    navigate("/");
    return null;
  }

  // Build graph data
  const nodes: GraphNode[] = [
    { id: 'article', name: result.topic, type: 'article' },
    ...result.claims.map((claim, idx) => ({
      id: `claim-${idx}`,
      name: `Claim ${idx + 1}`,
      type: 'claim' as const,
    })),
    ...result.sources.map((source, idx) => ({
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            New Search
          </Button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Grounded" className="h-6 w-6" />
            <h1 className="text-xl font-bold">Grounded Report</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Headline */}
        <section>
          <h2 className="text-3xl font-bold mb-2">{result.headline}</h2>
          <p className="text-muted-foreground">{result.topic}</p>
        </section>

        {/* Key Claims */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Key Claims</h3>
          <ClaimsList claims={result.claims} />
        </section>

        {/* Political Spectrum */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Political Spectrum Coverage</h3>
          <SpectrumBar sources={result.sources} />
        </section>

        {/* Source Cards */}
        <section>
          <h3 className="text-xl font-semibold mb-4">
            Sources ({result.sources.length})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.sources.map((source, idx) => {
              const sourceCitations = result.citations
                .filter(c => c.source_index === idx)
                .map(c => ({
                  excerpt: c.excerpt,
                  rationale: c.rationale,
                  page_number: c.page_number,
                }));
              return (
                <SourceCard
                  key={idx}
                  source={source}
                  citations={sourceCitations}
                />
              );
            })}
          </div>
        </section>

        {/* Mindmap Graph */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Relationship Mindmap</h3>
          <MindmapGraph nodes={nodes} edges={edges} />
          <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Cites</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Derives From</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span>Republishes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Contradicts</span>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section>
          <MetricsDisplay metrics={result.metrics} />
        </section>
      </main>
    </div>
  );
};

export default Results;
