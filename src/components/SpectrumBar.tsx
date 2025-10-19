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
          className="bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-xs font-medium text-white"
          style={{ width: `${leftPercent}%` }}
        >
          {leftPercent > 15 && `${Math.round(leftPercent)}%`}
        </div>
        <div
          className="bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center text-xs font-medium text-white"
          style={{ width: `${centerPercent}%` }}
        >
          {centerPercent > 15 && `${Math.round(centerPercent)}%`}
        </div>
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-xs font-medium text-white"
          style={{ width: `${rightPercent}%` }}
        >
          {rightPercent > 15 && `${Math.round(rightPercent)}%`}
        </div>
      </div>
    </div>
  );
};
