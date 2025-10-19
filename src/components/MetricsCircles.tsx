import { useState } from "react";
import { Metrics } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MetricsCirclesProps {
  metrics: Metrics;
}

export const MetricsCircles = ({ metrics }: MetricsCirclesProps) => {
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  const metricItems = [
    {
      id: "factual_accuracy",
      label: "Factual Accuracy",
      value: metrics.factual_accuracy,
      explanation: metrics.factual_accuracy_explanation || "Based on source traceability and verification",
      color: "text-green-400",
      strokeColor: "#22c55e",
    },
    {
      id: "clickbait_level",
      label: "Clickbait Level",
      value: metrics.clickbait_level,
      explanation: metrics.clickbait_explanation || "Evaluates headline sensationalism and emotional manipulation",
      color: "text-yellow-400",
      strokeColor: "#eab308",
    },
    {
      id: "bias_level",
      label: "Bias Level",
      value: metrics.bias_level,
      explanation: metrics.bias_explanation || "Assesses partisan lean and agenda-driven framing",
      color: "text-orange-400",
      strokeColor: "#f97316",
    },
    {
      id: "transparency",
      label: "Transparency",
      value: Math.round(metrics.transparency_score * 100),
      explanation: metrics.transparency_explanation || "Source citation quality and completeness",
      color: "text-blue-400",
      strokeColor: "#3b82f6",
    },
    {
      id: "confidence",
      label: "Confidence",
      value: Math.round(metrics.confidence_score * 100),
      explanation: metrics.confidence_explanation || "Overall reliability of the analysis",
      color: "text-purple-400",
      strokeColor: "#a855f7",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metricItems.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <Collapsible
              open={expandedMetric === item.id}
              onOpenChange={(open) => setExpandedMetric(open ? item.id : null)}
            >
              <CollapsibleTrigger className="group cursor-pointer">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="transform -rotate-90 w-24 h-24">
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-muted opacity-20"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      stroke={item.strokeColor}
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(item.value / 100) * 264} 264`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-xl font-bold ${item.color}`}>
                      {item.value}%
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-xs font-medium text-foreground">{item.label}</p>
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mt-1">
                    {expandedMetric === item.id ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        ))}
      </div>
      
      {/* Full-width explanation below all metrics */}
      {expandedMetric && (
        <div className="w-full animate-in fade-in slide-in-from-top-2 duration-300">
          <Card className="p-4 bg-muted/30 border-border/50">
            <h4 className="font-semibold text-foreground mb-2">
              {metricItems.find(m => m.id === expandedMetric)?.label}
            </h4>
            <p className="text-sm text-muted-foreground">
              {metricItems.find(m => m.id === expandedMetric)?.explanation}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};
