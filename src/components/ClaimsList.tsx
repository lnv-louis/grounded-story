import { Claim, Source } from "@/lib/types";
import { ClaimWithPopup } from "./ClaimWithPopup";

interface ClaimsListProps {
  claims: Claim[];
  sources: Source[];
}

export const ClaimsList = ({ claims, sources }: ClaimsListProps) => {
  return (
    <div className="space-y-3">
      {claims.map((claim, idx) => (
        <ClaimWithPopup key={idx} claim={claim} sources={sources} index={idx} />
      ))}
    </div>
  );
};
