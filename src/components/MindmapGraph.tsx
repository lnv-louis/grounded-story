import { useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { GraphNode, GraphEdge } from "@/lib/types";

interface MindmapGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const MindmapGraph = ({ nodes, edges }: MindmapGraphProps) => {
  const graphRef = useRef<any>();

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-300);
      graphRef.current.d3Force('link').distance(100);
    }
  }, []);

  const nodeColor = (node: GraphNode) => {
    if (node.type === 'article') return '#ffffff';
    if (node.type === 'claim') return '#60a5fa';
    if (node.political_lean === 'left') return '#ef4444';
    if (node.political_lean === 'center') return '#6b7280';
    if (node.political_lean === 'right') return '#3b82f6';
    return '#9ca3af';
  };

  const linkColor = (edge: GraphEdge) => {
    switch (edge.type) {
      case 'cites': return '#22c55e';
      case 'derives_from': return '#eab308';
      case 'republishes': return '#a855f7';
      case 'contradicts': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="w-full h-[500px] bg-card/30 rounded-lg border border-border/50 overflow-hidden">
      <ForceGraph2D
        ref={graphRef}
        graphData={{ nodes, links: edges }}
        nodeLabel="name"
        nodeColor={nodeColor}
        nodeRelSize={6}
        linkColor={linkColor}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        linkWidth={2}
        backgroundColor="rgba(0,0,0,0)"
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

          ctx.fillStyle = nodeColor(node);
          ctx.beginPath();
          ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
          ctx.fill();

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(label, node.x, node.y + 15);
        }}
      />
    </div>
  );
};
