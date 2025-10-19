import { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { GraphNode, GraphEdge } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MindmapGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const MindmapGraph = ({ nodes, edges }: MindmapGraphProps) => {
  const graphRef = useRef<any>();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-300);
      graphRef.current.d3Force('link').distance(100);
    }
  }, []);

  const nodeColor = (node: GraphNode) => {
    if (node.type === 'article') return '#ffffff';
    if (node.type === 'claim') return '#60a5fa';
    if (node.political_lean === 'left') return '#e57373';
    if (node.political_lean === 'center') return '#9ca3af';
    if (node.political_lean === 'right') return '#64b5f6';
    return '#9ca3af';
  };

  const linkColor = () => 'rgba(255, 255, 255, 0.2)';

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  };

  const handleLinkClick = (link: any) => {
    setSelectedEdge(link);
    setSelectedNode(null);
  };

  const handleResetZoom = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
    }
  };

  const getNodeDescription = (node: GraphNode) => {
    if (node.type === 'article') return 'Main topic being analyzed';
    if (node.type === 'claim') return 'A factual claim extracted from the content';
    if (node.type === 'source') {
      const typeDesc = node.source_type === 'primary' ? 'Original data or firsthand account' :
                      node.source_type === 'secondary' ? 'Reporting based on primary sources' :
                      'Analysis or commentary';
      return `Source: ${typeDesc}`;
    }
    return '';
  };

  const getEdgeDescription = (edge: GraphEdge) => {
    switch (edge.type) {
      case 'cites': return 'This source directly cites or references the other';
      case 'derives_from': return 'Information is derived or adapted from the original source';
      case 'republishes': return 'Content is republished or syndicated';
      case 'contradicts': return 'These sources provide conflicting information';
      default: return 'Related sources';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetZoom}
            className="gap-2"
          >
            <Maximize2 className="h-4 w-4" />
            Reset Zoom
          </Button>
        </div>
        {(selectedNode || selectedEdge) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedNode(null);
              setSelectedEdge(null);
            }}
          >
            Clear Selection
          </Button>
        )}
      </div>

      <div className="relative">
        <div className="w-full h-[350px] bg-card/30 rounded-lg border border-border/50 overflow-hidden">
          <ForceGraph2D
            ref={graphRef}
            graphData={{ nodes, links: edges }}
            nodeLabel="name"
            nodeColor={nodeColor}
            nodeRelSize={8}
            linkColor={linkColor}
            linkDirectionalArrowLength={6}
            linkDirectionalArrowRelPos={1}
            linkWidth={1.5}
            backgroundColor="rgba(0,0,0,0)"
            onNodeClick={handleNodeClick}
            onLinkClick={handleLinkClick}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.name;
              const fontSize = 12 / globalScale;
              const nodeRadius = 8;
              const isSelected = selectedNode?.id === node.id;
              
              // Draw node with glow effect
              ctx.shadowColor = nodeColor(node);
              ctx.shadowBlur = isSelected ? 25 : 15;
              ctx.fillStyle = nodeColor(node);
              ctx.beginPath();
              ctx.arc(node.x, node.y, isSelected ? nodeRadius * 1.3 : nodeRadius, 0, 2 * Math.PI, false);
              ctx.fill();
              ctx.shadowBlur = 0;

              // Draw label
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#ffffff';
              ctx.fillText(label, node.x, node.y + nodeRadius + 10);
            }}
          />
        </div>

        {selectedNode && (
          <Card className="absolute bottom-4 left-4 right-4 p-4 bg-card/95 backdrop-blur-md border-primary/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-foreground">{selectedNode.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{getNodeDescription(selectedNode)}</p>
                </div>
                {selectedNode.source_type && (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                    {selectedNode.source_type}
                  </span>
                )}
              </div>
            </div>
          </Card>
        )}

        {selectedEdge && (
          <Card className="absolute bottom-4 left-4 right-4 p-4 bg-card/95 backdrop-blur-md border-primary/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground capitalize">{selectedEdge.type.replace('_', ' ')}</h4>
              <p className="text-sm text-muted-foreground">{getEdgeDescription(selectedEdge)}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
