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
    if (node.political_lean === 'left') return '#e57373';
    if (node.political_lean === 'center') return '#9ca3af';
    if (node.political_lean === 'right') return '#64b5f6';
    return '#9ca3af';
  };

  const linkColor = () => 'rgba(255, 255, 255, 0.2)';

  return (
    <div className="w-full h-[500px] bg-card/30 rounded-lg border border-border/50 overflow-hidden">
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
        onNodeClick={(node: any) => {
          console.log('Node clicked:', node);
          // Future: show node details or preview
        }}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          const nodeRadius = 8;
          
          // Draw node with glow effect
          ctx.shadowColor = nodeColor(node);
          ctx.shadowBlur = 15;
          ctx.fillStyle = nodeColor(node);
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
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
  );
};
