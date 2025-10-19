import { Claim } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface ClaimsListProps {
  claims: Claim[];
}

const parseSourceChain = (chain: string) => {
  // Parse format like "The Guardian (secondary) → YouGov polling data (primary)"
  const parts = chain.split('→').map(s => s.trim());
  return parts.map(part => {
    const match = part.match(/^(.+?)\s*\((\w+)\)(?:\s*\[(.+?)\])?$/);
    if (match) {
      return {
        name: match[1].trim(),
        type: match[2] as 'primary' | 'secondary' | 'tertiary',
        url: match[3]?.trim(),
      };
    }
    return { name: part, type: 'secondary' as const, url: undefined };
  });
};

export const ClaimsList = ({ claims }: ClaimsListProps) => {
  const getTypeColor = (type: 'primary' | 'secondary' | 'tertiary') => {
    switch (type) {
      case 'primary':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'secondary':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'tertiary':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    }
  };

  return (
    <div className="space-y-3">
      {claims.map((claim, idx) => {
        const sourceChain = claim.source_chain ? parseSourceChain(claim.source_chain) : [];
        
        return (
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
            {sourceChain.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border/30">
                <p className="text-xs text-muted-foreground font-medium mb-2">Source Chain:</p>
                <div className="flex flex-wrap items-center gap-2">
                  {sourceChain.map((source, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      {source.url ? (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                        >
                          <Badge variant="outline" className={getTypeColor(source.type)}>
                            {source.name}
                          </Badge>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </a>
                      ) : (
                        <Badge variant="outline" className={getTypeColor(source.type)}>
                          {source.name}
                        </Badge>
                      )}
                      {sIdx < sourceChain.length - 1 && (
                        <span className="text-muted-foreground">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
