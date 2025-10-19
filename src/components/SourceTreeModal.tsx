import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReactFlowGraph } from "@/components/ReactFlowGraph";
import { GraphNode, GraphEdge, Claim } from "@/lib/types";

interface SourceTreeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodes: GraphNode[];
  edges: GraphEdge[];
  claims: Claim[];
}

export const SourceTreeModal = ({ open, onOpenChange, nodes, edges, claims }: SourceTreeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] h-[90vh] p-6">
        <DialogHeader>
          <DialogTitle>Interactive Source Tree</DialogTitle>
        </DialogHeader>
        <div className="flex-1 h-full">
          <ReactFlowGraph nodes={nodes} edges={edges} claims={claims} isModal={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
