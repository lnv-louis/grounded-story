import { Claim } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ClaimsListProps {
  claims: Claim[];
}

export const ClaimsList = ({ claims }: ClaimsListProps) => {
  return (
    <div className="space-y-3">
      {claims.map((claim, idx) => (
        <Card key={idx} className="p-4 bg-card/50 border-border/50">
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-foreground flex-1">{claim.claim_text}</p>
            <Badge 
              variant="outline" 
              className={
                claim.confidence >= 0.8 
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : claim.confidence >= 0.6
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              }
            >
              {Math.round(claim.confidence * 100)}%
            </Badge>
          </div>
          {claim.source_chain && (
            <div className="mt-3 pt-3 border-t border-border/30">
              <p className="text-xs text-muted-foreground font-medium mb-1">How do we know this?</p>
              <p className="text-xs text-muted-foreground">{claim.source_chain}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
