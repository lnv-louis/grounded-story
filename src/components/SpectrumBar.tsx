import { Source } from "@/lib/types";

interface SpectrumBarProps {
  sources: Source[];
}

export const SpectrumBar = ({ sources }: SpectrumBarProps) => {
  const leftCount = sources.filter(s => s.political_lean === 'left').length;
  const centerCount = sources.filter(s => s.political_lean === 'center').length;
  const rightCount = sources.filter(s => s.political_lean === 'right').length;
  const total = sources.length;

  const leftPercent = (leftCount / total) * 100;
  const centerPercent = (centerCount / total) * 100;
  const rightPercent = (rightCount / total) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Left ({leftCount})</span>
        <span>Center ({centerCount})</span>
        <span>Right ({rightCount})</span>
      </div>
      <div className="h-8 w-full flex rounded-lg overflow-hidden border border-border">
        <div
          className="flex items-center justify-center text-xs font-medium text-white transition-all hover:brightness-110"
          style={{ 
            width: `${leftPercent}%`,
            background: `linear-gradient(135deg, hsl(var(--spectrum-left)), hsl(var(--spectrum-left) / 0.8))`
          }}
        >
          {leftPercent > 15 && `${Math.round(leftPercent)}%`}
        </div>
        <div
          className="flex items-center justify-center text-xs font-medium text-white transition-all hover:brightness-110"
          style={{ 
            width: `${centerPercent}%`,
            background: `linear-gradient(135deg, hsl(var(--spectrum-center)), hsl(var(--spectrum-center) / 0.8))`
          }}
        >
          {centerPercent > 15 && `${Math.round(centerPercent)}%`}
        </div>
        <div
          className="flex items-center justify-center text-xs font-medium text-white transition-all hover:brightness-110"
          style={{ 
            width: `${rightPercent}%`,
            background: `linear-gradient(135deg, hsl(var(--spectrum-right)), hsl(var(--spectrum-right) / 0.8))`
          }}
        >
          {rightPercent > 15 && `${Math.round(rightPercent)}%`}
        </div>
      </div>
    </div>
  );
};
