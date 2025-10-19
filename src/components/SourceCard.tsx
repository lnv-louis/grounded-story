import { Source } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface SourceCardProps {
  source: Source;
  citations?: { excerpt: string; rationale?: string; page_number?: string }[];
}

export const SourceCard = ({ source, citations }: SourceCardProps) => {
  const typeColor = {
    primary: "bg-green-500/10 text-green-400 border-green-500/20",
    secondary: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    tertiary: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  }[source.source_type];

  return (
    <Card className="p-4 bg-card/50 border-border/50 hover:border-primary/30 transition-all group">
      {source.image_url && (
        <div className="mb-3 -mx-4 -mt-4 overflow-hidden rounded-t-lg">
          <img 
            src={source.image_url} 
            alt={source.outlet_name}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
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
        <Badge variant="outline" className={typeColor}>
          {source.source_type}
        </Badge>
        {source.category && (
          <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border/50">
            {source.category}
          </Badge>
        )}
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
