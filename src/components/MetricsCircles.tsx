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
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {metricItems.map((item) => (
          <Collapsible
            key={item.id}
            open={expandedMetric === item.id}
            onOpenChange={(open) => setExpandedMetric(open ? item.id : null)}
          >
            <div className="flex flex-col items-center">
              <CollapsibleTrigger className="group cursor-pointer">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="transform -rotate-90 w-28 h-28">
                    <circle
                      cx="56"
                      cy="56"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted opacity-20"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="50"
                      stroke={item.strokeColor}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(item.value / 100) * 314} 314`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-bold ${item.color}`}>
                      {item.value}%
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mt-1">
                    {expandedMetric === item.id ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 w-full">
                <Card className="p-3 bg-muted/30 border-border/50">
                  <p className="text-xs text-muted-foreground">{item.explanation}</p>
                </Card>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};
