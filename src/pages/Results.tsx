import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { ClaimsList } from "@/components/ClaimsList";
import { SourceCard } from "@/components/SourceCard";
import { ReactFlowGraph } from "@/components/ReactFlowGraph";
import { MetricsCircles } from "@/components/MetricsCircles";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { AnalysisResult, GraphNode, GraphEdge } from "@/lib/types";
import { toast } from "sonner";
import logo from "@/assets/grounded-logo.png";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result: AnalysisResult = location.state?.result;
  const originalQuery = location.state?.originalQuery;
  

  // Scroll animations for each section
  const metricsAnimation = useScrollAnimation();
  const headlineAnimation = useScrollAnimation();
  const claimsAnimation = useScrollAnimation();
  const sourcesAnimation = useScrollAnimation();

  useEffect(() => {
    if (!result) {
      navigate("/");
    }
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  // Build graph data - filter out empty sources - memoized for performance
  const validSources = useMemo(
    () => result.sources.filter(s => s.outlet_name && s.outlet_name.trim() !== ''),
    [result.sources]
  );
  
  const nodes: GraphNode[] = useMemo(
    () => [
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
    ],
    [result.topic, result.claims, validSources]
  );

  const edges: GraphEdge[] = useMemo(
    () => [
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
    ],
    [result.claims, result.citations, result.edges]
  );

  const handleShare = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
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
            {originalQuery && /^https?:\/\//i.test(originalQuery) ? (
              <a
                href={originalQuery}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Grounded Report
              </a>
            ) : (
              <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Grounded Report
              </h1>
            )}
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
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Results</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-10">
        {/* Metrics - Show First */}
        <section 
          ref={metricsAnimation.ref}
          className={`transition-all duration-700 ${
            metricsAnimation.isVisible
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">Analysis Metrics</h3>
          <MetricsCircles metrics={result.metrics} />
        </section>

        {/* Headline */}
        <section 
          ref={headlineAnimation.ref}
          className={`transition-all duration-700 ${
            headlineAnimation.isVisible
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
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
          ref={claimsAnimation.ref}
          className={`transition-all duration-700 ${
            claimsAnimation.isVisible
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">Key Claims</h3>
          <ClaimsList claims={result.claims} sources={validSources} />
        </section>

        {/* Two Column Layout - Source Tree & Sources */}
        <section 
          ref={sourcesAnimation.ref}
          className={`transition-all duration-700 ${
            sourcesAnimation.isVisible
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Source Tree</h3>
              <ReactFlowGraph nodes={nodes} edges={edges} claims={result.claims} />
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
