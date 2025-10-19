import { Metrics } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MetricsDisplayProps {
  metrics: Metrics;
}

export const MetricsDisplay = ({ metrics }: MetricsDisplayProps) => {
  return (
    <Card className="p-6 bg-card/50 border-border/50">
      <h3 className="text-lg font-semibold mb-4">Report Metrics</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Transparency Score</span>
            <span className="font-medium">{Math.round(metrics.transparency_score * 100)}%</span>
          </div>
          <Progress value={metrics.transparency_score * 100} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Confidence Score</span>
            <span className="font-medium">{Math.round(metrics.confidence_score * 100)}%</span>
          </div>
          <Progress value={metrics.confidence_score * 100} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spectrum Coverage</span>
            <span className="font-medium capitalize">{metrics.spectrum_coverage}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
