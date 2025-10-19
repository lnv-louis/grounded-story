import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraphNode, GraphEdge, Claim } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StaticSourceTreeProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  claims: Claim[];
}

export const StaticSourceTree = ({ nodes, edges, claims }: StaticSourceTreeProps) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Build tree structure: claims -> sources
  const claimNodes = nodes.filter(n => n.type === 'claim');
  const sourceNodes = nodes.filter(n => n.type === 'source');

  // Group sources by claim
  const claimToSources = new Map<number, GraphNode[]>();
  edges.forEach(edge => {
    if (edge.source.startsWith('claim-') && edge.target.startsWith('source-')) {
      const claimIdx = parseInt(edge.source.split('-')[1]);
      const sourceIdx = parseInt(edge.target.split('-')[1]);
      const sourceNode = sourceNodes[sourceIdx];
      if (sourceNode) {
        if (!claimToSources.has(claimIdx)) {
          claimToSources.set(claimIdx, []);
        }
        claimToSources.get(claimIdx)!.push(sourceNode);
      }
    }
  });

  // Build source chain - find sources that cite other sources
  const sourceChains = new Map<string, string[]>();
  edges.forEach(edge => {
    if (edge.source.startsWith('source-') && edge.target.startsWith('source-')) {
      if (!sourceChains.has(edge.source)) {
        sourceChains.set(edge.source, []);
      }
      sourceChains.get(edge.source)!.push(edge.target);
    }
  });

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'primary':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'secondary':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'tertiary':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default:
        return 'bg-muted/50 text-muted-foreground border-muted';
    }
  };

  const getPoliticalColor = (lean?: string) => {
    switch (lean) {
      case 'left':
        return 'bg-red-500/10 text-red-400';
      case 'right':
        return 'bg-blue-500/10 text-blue-400';
      case 'center':
        return 'bg-gray-500/10 text-gray-400';
      default:
        return 'bg-muted/50 text-muted-foreground';
    }
  };

  const renderSourceChain = (sourceId: string, depth: number = 0, visited: Set<string> = new Set()) => {
    if (visited.has(sourceId) || depth > 3) return null;
    visited.add(sourceId);

    const source = nodes.find(n => n.id === sourceId);
    if (!source) return null;

    const childSources = sourceChains.get(sourceId) || [];

    return (
      <div key={sourceId} className="relative">
        <div className={`flex items-center gap-2 ${depth > 0 ? 'ml-8 mt-2' : ''}`}>
          {depth > 0 && (
            <div className="absolute left-0 top-0 bottom-0 w-px bg-border/50" style={{ left: `${(depth - 1) * 32 + 12}px` }} />
          )}
          {depth > 0 && (
            <div className="absolute top-4 w-4 h-px bg-border/50" style={{ left: `${(depth - 1) * 32 + 12}px` }} />
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onMouseEnter={() => setHoveredNode(sourceId)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`transition-all ${hoveredNode === sourceId ? 'scale-105' : ''}`}
                >
                  <Badge
                    variant="outline"
                    className={`${getTypeColor(source.source_type)} cursor-pointer hover:shadow-md transition-all`}
                  >
                    {source.name}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <div className="space-y-2">
                  <p className="font-semibold">{source.name}</p>
                  {source.source_type && (
                    <Badge className={getTypeColor(source.source_type)} variant="outline">
                      {source.source_type}
                    </Badge>
                  )}
                  {source.political_lean && (
                    <Badge className={getPoliticalColor(source.political_lean)} variant="outline">
                      {source.political_lean} lean
                    </Badge>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {childSources.map(childId => renderSourceChain(childId, depth + 1, new Set(visited)))}
      </div>
    );
  };

  return (
    <Card className="p-6 bg-card/30 border-border/50 overflow-auto" style={{ minHeight: '600px', maxHeight: '800px' }}>
      <div className="space-y-6">
        {claimNodes.map((claimNode, idx) => {
          const claimIdx = parseInt(claimNode.id.split('-')[1]);
          const claim = claims[claimIdx];
          const sources = claimToSources.get(claimIdx) || [];

          if (sources.length === 0) return null;

          return (
            <div key={claimNode.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground line-clamp-2">
                    {claim?.claim_text || claimNode.name}
                  </p>
                </div>
              </div>

              <div className="ml-11 space-y-2">
                {sources.map(source => renderSourceChain(source.id))}
              </div>

              {idx < claimNodes.length - 1 && sources.length > 0 && (
                <div className="ml-5 h-px bg-border/30 my-4" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
