import { Source } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface SourceCardProps {
  source: Source;
  citations?: { excerpt: string; rationale?: string; page_number?: string }[];
}

export const SourceCard = ({ source, citations }: SourceCardProps) => {
  const leanColor = {
    left: "bg-red-500/20 text-red-400 border-red-500/30",
    center: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    right: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  }[source.political_lean];

  const typeColor = {
    primary: "bg-green-500/20 text-green-400 border-green-500/30",
    secondary: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    tertiary: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  }[source.source_type];

  return (
    <Card className="p-4 bg-card/50 border-border/50 hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-1">{source.outlet_name}</h4>
          {source.publish_date && (
            <p className="text-xs text-muted-foreground">
              {new Date(source.publish_date).toLocaleDateString()}
            </p>
          )}
        </div>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="flex gap-2 mb-3">
        <Badge variant="outline" className={leanColor}>
          {source.political_lean}
        </Badge>
        <Badge variant="outline" className={typeColor}>
          {source.source_type}
        </Badge>
      </div>

      {citations && citations.length > 0 && (
        <div className="space-y-2 mt-3 pt-3 border-t border-border/30">
          {citations.map((citation, idx) => (
            <div key={idx} className="text-sm">
              <p className="text-muted-foreground italic">"{citation.excerpt}"</p>
              {citation.page_number && (
                <p className="text-xs text-muted-foreground mt-1">
                  Page {citation.page_number}
                </p>
              )}
              {citation.rationale && (
                <p className="text-xs text-muted-foreground mt-1">
                  {citation.rationale}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
