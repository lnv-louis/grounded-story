import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Link as LinkIcon, Loader2 } from "lucide-react";
import { AnalysisResult } from "@/lib/types";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: AnalysisResult;
}

export const ShareModal = ({ open, onOpenChange, result }: ShareModalProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const shareCardRef = useState<HTMLDivElement | null>(null)[0];

  const topClaims = result.claims.slice(0, 3);
  const validSources = result.sources.filter(s => s.outlet_name && s.outlet_name.trim() !== '');

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const handleDownloadImage = async () => {
    const cardElement = document.getElementById('share-card');
    if (!cardElement) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#000000',
        scale: 2,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `grounded-report-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success("Image downloaded successfully");
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-400";
    if (confidence >= 0.6) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="flex-1 gap-2"
            >
              <LinkIcon className="h-4 w-4" />
              Copy Link
            </Button>
            <Button
              variant="default"
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className="flex-1 gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Download Image
            </Button>
          </div>

          {/* Share Card Preview */}
          <div
            id="share-card"
            className="bg-gradient-to-br from-background via-background to-accent/10 border border-border rounded-lg p-8 space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{result.headline}</h2>
              <p className="text-sm text-muted-foreground">{result.topic}</p>
            </div>

            {/* Top 3 Claims */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Key Claims</h3>
              {topClaims.map((claim, idx) => (
                <div key={idx} className="bg-card/50 border border-border/50 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm flex-1">{claim.claim_text}</p>
                    <span className={`text-xs font-semibold ${getConfidenceColor(claim.confidence)}`}>
                      {Math.round(claim.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Analysis Metrics */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Analysis Metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {Math.round(result.metrics.overall_confidence * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Confidence</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {Math.round(result.metrics.source_quality * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Source Quality</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {result.claims.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Claims</p>
                </div>
              </div>
            </div>

            {/* Source Tree Summary */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Sources ({validSources.length})</h3>
              <div className="space-y-2">
                {validSources.slice(0, 5).map((source, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-card/30 border border-border/30 rounded px-3 py-2">
                    <span className="font-medium truncate flex-1">{source.outlet_name}</span>
                    <span className="text-muted-foreground ml-2 capitalize">{source.source_type}</span>
                  </div>
                ))}
                {validSources.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{validSources.length - 5} more sources
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-border/50">
              <p className="text-sm font-semibold">Grounded Report</p>
              <p className="text-xs text-muted-foreground">Claim-to-Source Transparency</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
