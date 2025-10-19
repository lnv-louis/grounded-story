import { useState } from "react";
import { Metrics } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, Scale, Eye, TrendingUp } from "lucide-react";
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
      glowColor: "rgba(34, 197, 94, 0.3)",
      icon: CheckCircle2,
    },
    {
      id: "clickbait_level",
      label: "Clickbait Level",
      value: metrics.clickbait_level,
      explanation: metrics.clickbait_explanation || "Evaluates headline sensationalism and emotional manipulation",
      color: "text-yellow-400",
      strokeColor: "#eab308",
      glowColor: "rgba(234, 179, 8, 0.3)",
      icon: AlertTriangle,
    },
    {
      id: "bias_level",
      label: "Bias Level",
      value: metrics.bias_level,
      explanation: metrics.bias_explanation || "Assesses partisan lean and agenda-driven framing",
      color: "text-orange-400",
      strokeColor: "#f97316",
      glowColor: "rgba(249, 115, 22, 0.3)",
      icon: Scale,
    },
    {
      id: "transparency",
      label: "Transparency",
      value: Math.round(metrics.transparency_score * 100),
      explanation: metrics.transparency_explanation || "Source citation quality and completeness",
      color: "text-blue-400",
      strokeColor: "#3b82f6",
      glowColor: "rgba(59, 130, 246, 0.3)",
      icon: Eye,
    },
    {
      id: "confidence",
      label: "Confidence",
      value: Math.round(metrics.confidence_score * 100),
      explanation: metrics.confidence_explanation || "Overall reliability of the analysis",
      color: "text-purple-400",
      strokeColor: "#a855f7",
      glowColor: "rgba(168, 85, 247, 0.3)",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {metricItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex flex-col items-center">
              <Collapsible
                open={expandedMetric === item.id}
                onOpenChange={(open) => setExpandedMetric(open ? item.id : null)}
              >
                <CollapsibleTrigger className="group cursor-pointer">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Glow effect */}
                    <div 
                      className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ backgroundColor: item.glowColor }}
                    />
                    
                    {/* Outer ring with gradient */}
                    <svg className="transform -rotate-90 w-32 h-32 relative z-10">
                      <defs>
                        <linearGradient id={`gradient-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={item.strokeColor} stopOpacity="1" />
                          <stop offset="100%" stopColor={item.strokeColor} stopOpacity="0.6" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-muted opacity-10"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke={`url(#gradient-${item.id})`}
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${(item.value / 100) * 352} 352`}
                        strokeLinecap="round"
                        className="transition-all duration-700 drop-shadow-lg"
                        style={{ filter: `drop-shadow(0 0 8px ${item.strokeColor})` }}
                      />
                    </svg>
                    
                    {/* Center content with icon */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Icon className={`h-8 w-8 mb-1 ${item.color} transition-transform group-hover:scale-110 duration-300`} />
                      <span className={`text-2xl font-bold ${item.color}`}>
                        {item.value}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
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
          );
        })}
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
