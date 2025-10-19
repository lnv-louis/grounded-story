import { Claim, Source } from "@/lib/types";
import { ClaimWithPopup } from "./ClaimWithPopup";

interface ClaimsListProps {
  claims: Claim[];
  sources: Source[];
}

export const ClaimsList = ({ claims, sources }: ClaimsListProps) => {
  const keyClaims = claims.slice(0, 7);
  const additionalClaims = claims.slice(7);

  return (
    <div className="space-y-6">
      {/* Key Claims - Full Display */}
      <div className="space-y-3">
        {keyClaims.map((claim, idx) => (
          <ClaimWithPopup key={idx} claim={claim} sources={sources} index={idx} />
        ))}
      </div>

      {/* Additional Claims - Compact Grid */}
      {additionalClaims.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Additional Claims ({additionalClaims.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {additionalClaims.map((claim, idx) => (
              <ClaimWithPopup 
                key={idx + 7} 
                claim={claim} 
                sources={sources} 
                index={idx + 7}
                compact
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
