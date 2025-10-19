import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { AnalysisResultSchema } from "@/lib/types";
import { toast } from "sonner";
import logo from "@/assets/grounded-logo.png";

const Loading = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.state?.query;
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    "Analyzing query...",
    "Fetching sources...",
    "Extracting claims...",
    "Computing metrics...",
    "Building visualizations...",
    "Report ready!"
  ];

  useEffect(() => {
    if (!query) {
      navigate("/");
      return;
    }

    const stepDuration = 400; // ms per step

    // Start the API call immediately
    const analyzeQuery = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('analyze-query', {
          body: { query }
        });

        if (error) throw error;

        // Validate response
        const result = AnalysisResultSchema.parse(data);
        
        // Wait for animations to complete before navigating
        setTimeout(() => {
          navigate('/results', { state: { result }, replace: true });
        }, steps.length * stepDuration + 300);
      } catch (err: any) {
        console.error('Analysis error:', err);
        setError(err.message || 'Failed to analyze query');
        toast.error(err.message || 'Failed to analyze query');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    };

    analyzeQuery();

    // Animate progress steps
    let stepIndex = 0;
    
    const interval = setInterval(() => {
      stepIndex++;
      setCurrentStep(stepIndex);
      setProgress((stepIndex / steps.length) * 100);

      if (stepIndex >= steps.length) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [query, navigate, steps.length]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Granular mesh gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/20 to-background" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6">
        <Card className="p-8 bg-card/80 backdrop-blur-md border-border/50">
          <div className="flex flex-col items-center space-y-6">
            <img src={logo} alt="Grounded" className="h-16 w-16 animate-pulse" />
            <h2 className="text-2xl font-bold text-center">
              {error ? 'Analysis Failed' : 'Generating Your Report'}
            </h2>
            
            {error ? (
              <div className="w-full space-y-4">
                <p className="text-center text-destructive">{error}</p>
                <p className="text-center text-sm text-muted-foreground">Redirecting to homepage...</p>
              </div>
            ) : (
              <div className="w-full space-y-4">
                <Progress value={progress} className="h-2" />
                
                <div className="space-y-2">
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 transition-all duration-300 ${
                        idx < currentStep
                          ? "opacity-50"
                          : idx === currentStep
                          ? "opacity-100 scale-105"
                          : "opacity-30"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx < currentStep
                            ? "bg-green-500"
                            : idx === currentStep
                            ? "bg-primary animate-pulse"
                            : "bg-muted"
                        }`}
                      />
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Loading;
