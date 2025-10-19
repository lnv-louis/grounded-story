import { useState, useRef } from "react";
import { Claim, Source } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/formatters";

interface ClaimWithPopupProps {
  claim: Claim;
  sources: Source[];
  index: number;
}

const POPUP_OFFSET = 10; // pixels away from cursor
const POPUP_WIDTH = 384; // max-w-sm = 24rem = 384px

const parseSourceChain = (chain: string) => {
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

export const ClaimWithPopup = ({ claim, sources, index }: ClaimWithPopupProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  const sourceChain = claim.source_chain ? parseSourceChain(claim.source_chain) : [];

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

  const handleMouseEnter = (e: React.MouseEvent) => {
    updatePopupPosition(e);
    setShowPopup(true);
  };

  const updatePopupPosition = (e: React.MouseEvent) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let x = e.clientX + POPUP_OFFSET;
    let y = e.clientY + POPUP_OFFSET;
    
    // Check if popup would go off right edge
    if (x + POPUP_WIDTH > viewportWidth) {
      x = e.clientX - POPUP_WIDTH - POPUP_OFFSET;
    }
    
    // Check if popup would go off bottom edge (estimate height ~300px)
    if (y + 300 > viewportHeight) {
      y = e.clientY - 300 - POPUP_OFFSET;
    }
    
    // Ensure it doesn't go off left edge
    if (x < POPUP_OFFSET) {
      x = POPUP_OFFSET;
    }
    
    // Ensure it doesn't go off top edge
    if (y < POPUP_OFFSET) {
      y = POPUP_OFFSET;
    }
    
    setPopupPosition({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (showPopup) {
      updatePopupPosition(e);
    }
  };

  return (
    <Card 
      ref={cardRef}
      className="p-4 bg-card/50 border-border/50 relative cursor-pointer hover:border-primary/50 transition-all"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowPopup(false)}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-foreground flex-1">{claim.claim_text}</p>
        <div className="flex flex-col items-end gap-1">
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
          {claim.confidence_explanation && (
            <p className="text-xs text-muted-foreground text-right max-w-xs">
              {claim.confidence_explanation}
            </p>
          )}
        </div>
      </div>
      
      {sourceChain.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/30">
          <div className="flex flex-wrap items-center gap-2">
            {sourceChain.map((source, sIdx) => (
              <div key={sIdx} className="flex items-center gap-2">
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
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

      {/* Hover Popup */}
      {showPopup && sourceChain.length > 0 && (
        <div
          className="fixed z-[100] pointer-events-none"
          style={{
            left: `${popupPosition.x}px`,
            top: `${popupPosition.y}px`,
          }}
        >
          <Card className="p-4 bg-card/95 backdrop-blur-md border-primary/50 shadow-2xl max-w-sm animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold text-primary">Source Traceability</h4>
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
                  {Math.round(claim.confidence * 100)}% confident
                </Badge>
              </div>
              
              <div className="space-y-2">
                {sourceChain.map((source, idx) => {
                  const matchedSource = sources.find(s => 
                    s.outlet_name.toLowerCase().includes(source.name.toLowerCase()) ||
                    source.name.toLowerCase().includes(s.outlet_name.toLowerCase())
                  );

                  return (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-2 h-2 rounded-full ${
                          source.type === 'primary' ? 'bg-green-500' :
                          source.type === 'secondary' ? 'bg-yellow-500' :
                          'bg-orange-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {source.name}
                          </p>
                          <Badge variant="outline" className={`${getTypeColor(source.type)} text-xs`}>
                            {source.type}
                          </Badge>
                        </div>
                        {matchedSource && (
                          <div className="space-y-1">
                            {matchedSource.category && (
                              <p className="text-xs text-muted-foreground">
                                {matchedSource.category}
                              </p>
                            )}
                            {matchedSource.publish_date && (
                              <p className="text-xs text-muted-foreground">
                                {formatDate(matchedSource.publish_date)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      {idx < sourceChain.length - 1 && (
                        <div className="flex-shrink-0 text-muted-foreground">↓</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {claim.confidence_explanation && (
                <div className="pt-2 border-t border-border/30">
                  <p className="text-xs text-muted-foreground">
                    {claim.confidence_explanation}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};
