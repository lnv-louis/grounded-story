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
  const [error, setError] = useState<string | null>(null);
  const [isApiComplete, setIsApiComplete] = useState(false);
  const [apiResult, setApiResult] = useState<any>(null);
  const [progressBars, setProgressBars] = useState({
    analyzing: 0,
    fetching: 0,
    extracting: 0,
    computing: 0,
    building: 0,
  });

  useEffect(() => {
    if (!query) {
      navigate("/");
      return;
    }

    // Start the API call immediately
    const analyzeQuery = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('analyze-query', {
          body: { query }
        });

        if (error) throw error;

        // Validate response
        const result = AnalysisResultSchema.parse(data);
        setApiResult(result);
        setIsApiComplete(true);
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
  }, [query, navigate]);

  // Animate progress bars independently
  useEffect(() => {
    if (error) return;

    const animateBar = (key: keyof typeof progressBars, delay: number, duration: number) => {
      setTimeout(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min((elapsed / duration) * 100, 100);
          
          setProgressBars(prev => ({ ...prev, [key]: progress }));
          
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 16); // ~60fps
      }, delay);
    };

    // Stagger the progress bars
    animateBar('analyzing', 0, 1000);
    animateBar('fetching', 400, 1500);
    animateBar('extracting', 900, 1200);
    animateBar('computing', 1500, 1000);
    animateBar('building', 2100, 800);
  }, [error]);

  // Navigate when both API and animations are complete
  useEffect(() => {
    const allComplete = Object.values(progressBars).every(v => v >= 100);
    if (isApiComplete && allComplete && apiResult) {
      setTimeout(() => {
        navigate('/results', { 
          state: { 
            result: apiResult,
            originalQuery: query
          }, 
          replace: true 
        });
      }, 300);
    }
  }, [isApiComplete, progressBars, apiResult, query, navigate]);

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
              <div className="w-full space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">Analyzing query...</span>
                      <span className="text-muted-foreground">{Math.round(progressBars.analyzing)}%</span>
                    </div>
                    <Progress value={progressBars.analyzing} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">Fetching sources...</span>
                      <span className="text-muted-foreground">{Math.round(progressBars.fetching)}%</span>
                    </div>
                    <Progress value={progressBars.fetching} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">Extracting claims...</span>
                      <span className="text-muted-foreground">{Math.round(progressBars.extracting)}%</span>
                    </div>
                    <Progress value={progressBars.extracting} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">Computing metrics...</span>
                      <span className="text-muted-foreground">{Math.round(progressBars.computing)}%</span>
                    </div>
                    <Progress value={progressBars.computing} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">Building visualizations...</span>
                      <span className="text-muted-foreground">{Math.round(progressBars.building)}%</span>
                    </div>
                    <Progress value={progressBars.building} className="h-2" />
                  </div>
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
