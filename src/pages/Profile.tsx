import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Trash2, FileText } from "lucide-react";
import logo from "@/assets/grounded-logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { formatDistanceToNow } from "date-fns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface SavedReport {
  id: string;
  query: string;
  headline: string | null;
  topic: string | null;
  created_at: string;
  analysis_data: any;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_reports")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchReports(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, fetchReports]);

  const handleDeleteReport = useCallback(async (reportId: string) => {
    try {
      const { error } = await supabase
        .from("user_reports")
        .delete()
        .eq("id", reportId);

      if (error) throw error;
      
      setReports(prev => prev.filter(r => r.id !== reportId));
      toast.success("Report deleted");
    } catch (error: any) {
      toast.error("Failed to delete report");
    }
  }, []);

  const handleViewReport = useCallback((report: SavedReport) => {
    navigate("/results", {
      state: {
        result: report.analysis_data,
        originalQuery: report.query,
      },
    });
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/");
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Grounded" className="h-7 w-7" />
              <h1 className="text-2xl font-bold">Grounded</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Account Information</h2>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Saved Reports ({reports.length})</h2>
            </div>

            {reports.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No saved reports yet</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/")}
                >
                  Create Your First Report
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <Card
                    key={report.id}
                    className="p-4 hover:bg-accent/5 transition-colors cursor-pointer"
                    onClick={() => handleViewReport(report)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 truncate">
                          {report.headline || report.topic || "Untitled Report"}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate mb-2">
                          {report.query}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReport(report.id);
                        }}
                        className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
