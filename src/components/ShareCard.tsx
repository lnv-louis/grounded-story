import { useRef } from "react";
import { AnalysisResult } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, X, Target, Flame, Scale, Eye } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import logo from "@/assets/grounded-logo.png";
import { format } from "date-fns";

interface ShareCardProps {
  result: AnalysisResult;
  onClose: () => void;
}

export const ShareCard = ({ result, onClose }: ShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `grounded-report-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast.success("Report card downloaded");
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error("Failed to download card");
    }
  };

  const validSources = result.sources.filter(s => s.url_valid !== false);
  const topClaim = result.claims[0];
  const topSources = validSources.slice(0, 5);
  const formattedDate = format(new Date(), "MMMM do yyyy");

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 pt-24">
      <div className="relative max-w-2xl w-full">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute -top-12 right-0"
        >
          <X className="h-5 w-5" />
        </Button>

        <Card 
          ref={cardRef}
          className="p-8 bg-gradient-to-br from-card via-card to-accent/10 border-2 border-primary/20"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Grounded" className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Grounded Report</h1>
                <p className="text-sm text-muted-foreground">Trace the story to its source.</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {result.metrics.factual_accuracy}%
              </div>
              <div className="text-xs text-muted-foreground">Factual Accuracy</div>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {result.headline}
            </h2>
            <p className="text-sm text-muted-foreground">{result.topic}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="text-center p-3 bg-card/50 rounded-lg border border-border/30">
              <div className="flex justify-center mb-1">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div className="text-xl font-bold text-primary">
                {result.metrics.factual_accuracy}%
              </div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center p-3 bg-card/50 rounded-lg border border-border/30">
              <div className="flex justify-center mb-1">
                <Flame className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="text-xl font-bold text-yellow-400">
                {result.metrics.clickbait_level}%
              </div>
              <div className="text-xs text-muted-foreground">Clickbait</div>
            </div>
            <div className="text-center p-3 bg-card/50 rounded-lg border border-border/30">
              <div className="flex justify-center mb-1">
                <Scale className="h-5 w-5 text-orange-400" />
              </div>
              <div className="text-xl font-bold text-orange-400">
                {result.metrics.bias_level}%
              </div>
              <div className="text-xs text-muted-foreground">Bias</div>
            </div>
            <div className="text-center p-3 bg-card/50 rounded-lg border border-border/30">
              <div className="flex justify-center mb-1">
                <Eye className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-xl font-bold text-blue-400">
                {Math.round(result.metrics.transparency_score * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Transparency</div>
            </div>
          </div>

          {/* Top Claim */}
          {topClaim && (
            <div className="mb-6 p-4 bg-card/30 rounded-lg border border-border/30">
              <div className="text-xs text-muted-foreground mb-2">Top Claim</div>
              <p className="text-sm text-foreground mb-2">{topClaim.claim_text}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Confidence</span>
                <span className="text-sm font-semibold text-green-400">
                  {Math.round(topClaim.confidence * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Summary */}
          {result.summary && (
            <div className="mb-6">
              <div className="text-xs text-muted-foreground mb-2">AI Summary</div>
              <p className="text-sm text-foreground/90 italic">"{result.summary}"</p>
            </div>
          )}

          {/* Key Sources */}
          {topSources.length > 0 && (
            <div className="mb-4 p-3 bg-card/30 rounded-lg border border-border/30">
              <div className="text-xs text-muted-foreground mb-2">Key Sources</div>
              <div className="flex flex-wrap gap-2">
                {topSources.map((source, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                    {source.outlet_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sources Summary */}
          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <div className="text-sm text-muted-foreground">
              Analyzed {result.claims.length} claims from {validSources.length} sources
            </div>
            <div className="text-xs text-muted-foreground">
              Generated {formattedDate}
            </div>
          </div>
        </Card>

        <div className="mt-4 flex justify-center gap-3">
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download Card
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
