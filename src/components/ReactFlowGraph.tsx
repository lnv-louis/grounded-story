import { useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { GraphNode, GraphEdge, Claim } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ZoomOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface ReactFlowGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  claims: Claim[];
}

export const ReactFlowGraph = ({ nodes, edges, claims }: ReactFlowGraphProps) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);

  const isDark = !document.documentElement.classList.contains('light');

  const nodeColor = (node: GraphNode) => {
    if (node.type === 'article') return '#ffffff';
    if (node.type === 'claim') return '#60a5fa';
    if (node.political_lean === 'left') return '#e57373';
    if (node.political_lean === 'center') return '#9ca3af';
    if (node.political_lean === 'right') return '#64b5f6';
    return '#9ca3af';
  };

  const getNodeLabel = (node: GraphNode) => {
    if (node.type === 'claim') {
      const claimIndex = parseInt(node.id.split('-')[1]);
      if (claims[claimIndex]) {
        const claimText = claims[claimIndex].claim_text;
        return claimText.length > 50 ? claimText.substring(0, 47) + '...' : claimText;
      }
    }
    return node.name;
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

  // Convert GraphNode[] to ReactFlow Node[]
  const reactFlowNodes: Node[] = useMemo(() => {
    const articleNodes = nodes.filter(n => n.type === 'article');
    const claimNodes = nodes.filter(n => n.type === 'claim');
    const sourceNodes = nodes.filter(n => n.type === 'source');

    const result: Node[] = [];

    // Article at top center
    articleNodes.forEach((node, i) => {
      result.push({
        id: node.id,
        type: 'default',
        data: { label: getNodeLabel(node) },
        position: { x: 400, y: 50 },
        style: {
          background: nodeColor(node),
          color: isDark ? '#000' : '#fff',
          border: selectedNode?.id === node.id ? '2px solid #60a5fa' : '1px solid #ddd',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '14px',
          fontWeight: 'bold',
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });
    });

    // Claims in second row
    claimNodes.forEach((node, i) => {
      const xPos = 200 + (i * 200);
      result.push({
        id: node.id,
        type: 'default',
        data: { label: getNodeLabel(node) },
        position: { x: xPos, y: 200 },
        style: {
          background: nodeColor(node),
          color: isDark ? '#000' : '#fff',
          border: selectedNode?.id === node.id ? '2px solid #60a5fa' : '1px solid #ddd',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '12px',
          maxWidth: '150px',
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });
    });

    // Sources in third row
    sourceNodes.forEach((node, i) => {
      const xPos = 150 + (i * 180);
      result.push({
        id: node.id,
        type: 'default',
        data: { label: node.name },
        position: { x: xPos, y: 400 },
        style: {
          background: nodeColor(node),
          color: isDark ? '#000' : '#fff',
          border: selectedNode?.id === node.id ? '2px solid #60a5fa' : '1px solid #ddd',
          borderRadius: '8px',
          padding: '8px',
          fontSize: '11px',
          maxWidth: '120px',
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });
    });

    return result;
  }, [nodes, claims, selectedNode, isDark]);

  // Convert GraphEdge[] to ReactFlow Edge[]
  const reactFlowEdges: Edge[] = useMemo(() => {
    return edges.map(edge => ({
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      animated: edge.type === 'contradicts',
      style: {
        stroke: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.3)',
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.3)',
      },
    }));
  }, [edges, isDark]);

  const [rfNodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);
  const [rfEdges, setEdges, onEdgesChange] = useEdgesState(reactFlowEdges);

  const onNodeClick = useCallback((event: any, node: any) => {
    const graphNode = nodes.find(n => n.id === node.id);
    if (graphNode) {
      setSelectedNode(graphNode);
      setSelectedEdge(null);
    }
  }, [nodes]);

  const onEdgeClick = useCallback((event: any, edge: any) => {
    const graphEdge = edges.find(e => `${e.source}-${e.target}` === edge.id);
    if (graphEdge) {
      setSelectedEdge(graphEdge);
      setSelectedNode(null);
    }
  }, [edges]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // React Flow uses fitView for zoom out
            const viewport = document.querySelector('.react-flow__viewport');
            if (viewport) {
              // This will be handled by the Controls component
            }
          }}
          className="gap-2"
        >
          <ZoomOut className="h-4 w-4" />
          Zoom Out
        </Button>
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
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            fitView
            attributionPosition="bottom-left"
            className={isDark ? 'dark' : 'light'}
          >
            <Background />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                const graphNode = nodes.find(n => n.id === node.id);
                return graphNode ? nodeColor(graphNode) : '#9ca3af';
              }}
              style={{
                backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
              }}
            />
          </ReactFlow>
        </div>

        {selectedNode && (
          <Card className="absolute bottom-4 left-4 right-4 p-4 bg-card/95 backdrop-blur-md border-primary/50 animate-in fade-in slide-in-from-bottom-2 duration-300 z-10">
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
          <Card className="absolute bottom-4 left-4 right-4 p-4 bg-card/95 backdrop-blur-md border-primary/50 animate-in fade-in slide-in-from-bottom-2 duration-300 z-10">
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
