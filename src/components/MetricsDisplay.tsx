import { Metrics } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MetricsDisplayProps {
  metrics: Metrics;
}

const getScoreColor = (score: number, inverse: boolean = false) => {
  if (inverse) {
    // For clickbait and bias - lower is better
    if (score <= 30) return "text-green-400";
    if (score <= 60) return "text-yellow-400";
    return "text-red-400";
  }
  // For accuracy - higher is better
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
};

const getProgressColor = (score: number, inverse: boolean = false) => {
  if (inverse) {
    if (score <= 30) return "[&>div]:bg-green-500";
    if (score <= 60) return "[&>div]:bg-yellow-500";
    return "[&>div]:bg-red-500";
  }
  if (score >= 70) return "[&>div]:bg-green-500";
  if (score >= 40) return "[&>div]:bg-yellow-500";
  return "[&>div]:bg-red-500";
};

export const MetricsDisplay = ({ metrics }: MetricsDisplayProps) => {
  return (
    <Card className="p-6 bg-card/50 border-border/50">
      <h3 className="text-lg font-semibold mb-6">Analysis Metrics</h3>
      <div className="space-y-6">
        {/* New Core Metrics */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <div>
              <span className="text-foreground font-medium">Factual Accuracy</span>
              <p className="text-xs text-muted-foreground mt-1">
                How much can be traced to reliable sources
              </p>
            </div>
            <span className={`font-bold text-lg ${getScoreColor(metrics.factual_accuracy)}`}>
              {metrics.factual_accuracy}%
            </span>
          </div>
          <Progress 
            value={metrics.factual_accuracy} 
            className={`h-2 ${getProgressColor(metrics.factual_accuracy)}`}
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <div>
              <span className="text-foreground font-medium">Clickbait Level</span>
              <p className="text-xs text-muted-foreground mt-1">
                Emotional or misleading phrasing detected
              </p>
            </div>
            <span className={`font-bold text-lg ${getScoreColor(metrics.clickbait_level, true)}`}>
              {metrics.clickbait_level}%
            </span>
          </div>
          <Progress 
            value={metrics.clickbait_level} 
            className={`h-2 ${getProgressColor(metrics.clickbait_level, true)}`}
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <div>
              <span className="text-foreground font-medium">Bias Level</span>
              <p className="text-xs text-muted-foreground mt-1">
                Partisan or agenda-driven framing
              </p>
            </div>
            <span className={`font-bold text-lg ${getScoreColor(metrics.bias_level, true)}`}>
              {metrics.bias_level}%
            </span>
          </div>
          <Progress 
            value={metrics.bias_level} 
            className={`h-2 ${getProgressColor(metrics.bias_level, true)}`}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 pt-4 space-y-4">
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
          {metrics.political_distribution && (
            <div>
              <div className="text-sm text-muted-foreground mb-2">Political Source Distribution</div>
              <div className="flex gap-4 text-sm">
                <span>Left: {metrics.political_distribution.left}</span>
                <span>Center: {metrics.political_distribution.center}</span>
                <span>Right: {metrics.political_distribution.right}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
