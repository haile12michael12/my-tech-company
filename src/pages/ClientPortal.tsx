import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import PortalSidebar, { type PortalView } from "@/components/portal/PortalSidebar";
import PortalDashboard from "@/components/portal/PortalDashboard";
import PortalProjects from "@/components/portal/PortalProjects";
import PortalFiles from "@/components/portal/PortalFiles";
import PortalInvoices from "@/components/portal/PortalInvoices";
import PortalTickets from "@/components/portal/PortalTickets";
import PortalRoadmap from "@/components/portal/PortalRoadmap";
import PortalMessages from "@/components/portal/PortalMessages";
import PortalSettings from "@/components/portal/PortalSettings";

const viewComponents: Record<PortalView, React.ComponentType<any>> = {
  dashboard: PortalDashboard,
  projects: PortalProjects,
  files: PortalFiles,
  invoices: PortalInvoices,
  tickets: PortalTickets,
  roadmap: PortalRoadmap,
  messages: PortalMessages,
  settings: PortalSettings,
};

const ClientPortal = () => {
  const [sidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<PortalView>("dashboard");
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const initials = profile?.display_name
    ? profile.display_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase() ?? "??";

  const displayName = profile?.display_name || user.email || "User";

  const ActiveComponent = viewComponents[activeView];

  return (
    <div className="min-h-screen bg-background flex">
      <PortalSidebar activeView={activeView} onViewChange={setActiveView} open={sidebarOpen} />

      <main className={cn("flex-1 transition-all duration-300", sidebarOpen ? "ml-64" : "ml-20")}>
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 h-9" />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                {initials}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{displayName}</div>
                <div className="text-xs text-muted-foreground capitalize">{profile?.role || "Client"}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        <div className="p-6">
          <ActiveComponent onNavigate={setActiveView} />
        </div>
      </main>
    </div>
  );
};

export default ClientPortal;
