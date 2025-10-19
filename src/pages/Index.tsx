import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AnalysisResultSchema } from "@/lib/types";
import { toast } from "sonner";
import logo from "@/assets/grounded-logo.png";
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check current auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-query', {
        body: { query }
      });

      if (error) throw error;

      // Validate response
      const result = AnalysisResultSchema.parse(data);
      
      navigate('/loading', { state: { result } });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(error.message || 'Failed to analyze query');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Shader Gradient Background */}
      <div className="absolute inset-0 z-0">
        <ShaderGradientCanvas
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          pointerEvents="none"
        >
          <ShaderGradient
            control='query'
            urlString='https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=0.2&cAzimuthAngle=180&cDistance=4&cPolarAngle=90&cameraZoom=1&color1=%230A0A0A&color2=%237A7A7A&color3=%2320d3a8&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=40&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=2.1&positionX=-1.4&positionY=1&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&toggleAxis=false&type=waterPlane&uAmplitude=0&uDensity=2.1&uFrequency=5.5&uSpeed=0.1&uStrength=5.3&uTime=0&wireframe=false&zoomOut=false'
          />
        </ShaderGradientCanvas>
      </div>

      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Grounded" className="h-8 w-8" />
            <span className="text-2xl font-bold">Grounded</span>
          </div>
          <div className="flex gap-4 items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/auth')}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-gradient">
              Claim-to-Source Transparency
            </h1>
          </div>

          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          <div className="text-center text-sm text-muted-foreground">
            Powered by Perplexity Sonar • Multi-perspective analysis • Political spectrum visualization
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 relative z-10">
        <div className="container mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
          © 2025 Grounded. Built for transparency.
        </div>
      </footer>
    </div>
  );
};

export default Index;
