import { Source } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { formatDate } from "@/lib/formatters";

interface SourceCardProps {
  source: Source;
  citations: Array<{
    excerpt: string;
    rationale?: string;
    page_number?: string;
  }>;
}

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

const getUrlValidityBadge = (url: string, urlValid?: boolean) => {
  if (!url || url.trim() === '') {
    return (
      <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/20 gap-1">
        <XCircle className="h-3 w-3" />
        No URL
      </Badge>
    );
  }
  
  if (urlValid === false) {
    return (
      <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 gap-1">
        <AlertCircle className="h-3 w-3" />
        Invalid Link
      </Badge>
    );
  }
  
  if (urlValid === true) {
    return (
      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Verified
      </Badge>
    );
  }
  
  return null;
};

export const SourceCard = ({ source, citations }: SourceCardProps) => {
  const hasValidUrl = source.url && source.url.trim() !== '' && source.url_valid !== false;

  return (
    <Card className="p-4 bg-card/50 border-border/50 hover:border-primary/30 transition-all">
      <div className="space-y-3">
        {/* Source Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {hasValidUrl ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  {source.outlet_name}
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ) : (
                <span className="font-semibold text-foreground">{source.outlet_name}</span>
              )}
              {getUrlValidityBadge(source.url, source.url_valid)}
            </div>
            {source.category && (
              <p className="text-xs text-muted-foreground">{source.category}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="outline" className={getTypeColor(source.source_type)}>
              {source.source_type}
            </Badge>
            {source.political_lean && (
              <Badge 
                variant="outline" 
                className={
                  source.political_lean === 'left' 
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : source.political_lean === 'right'
                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                    : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                }
              >
                {source.political_lean}
              </Badge>
            )}
          </div>
        </div>

        {/* Publish Date */}
        {source.publish_date && (
          <p className="text-xs text-muted-foreground">
            Published {formatDate(source.publish_date)}
          </p>
        )}

        {/* Citations */}
        {citations.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/30">
            <p className="text-xs font-medium text-muted-foreground">
              {citations.length} Citation{citations.length !== 1 ? 's' : ''}
            </p>
            {citations.map((citation, idx) => (
              <div key={idx} className="text-xs space-y-1 pl-3 border-l-2 border-primary/20">
                <p className="text-foreground/90 italic">"{citation.excerpt}"</p>
                {citation.rationale && (
                  <p className="text-muted-foreground">{citation.rationale}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
