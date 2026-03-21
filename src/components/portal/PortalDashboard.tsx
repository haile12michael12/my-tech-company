import { useEffect, useState } from "react";
import {
  FolderKanban,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PortalView } from "./PortalSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface DashboardProject {
  name: string;
  progress: number;
  status: string;
  due_date: string | null;
  tasks_completed: number;
  tasks_total: number;
}

interface Props {
  onNavigate: (view: PortalView) => void;
}

const PortalDashboard = ({ onNavigate }: Props) => {
  const { user, profile } = useAuth();
  const firstName = profile?.display_name?.split(" ")[0] || "there";

  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [ticketCount, setTicketCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetch = async () => {
      const [{ data: projData }, { count: openTickets }] = await Promise.all([
        supabase
          .from("projects")
          .select("name, progress, status, due_date, tasks_completed, tasks_total")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("tickets")
          .select("*", { count: "exact", head: true })
          .eq("client_id", user.id)
          .in("status", ["Open", "In Progress"]),
      ]);

      setProjects(
        (projData || []).map((p) => ({
          name: p.name,
          progress: p.progress ?? 0,
          status: p.status ?? "In Progress",
          due_date: p.due_date,
          tasks_completed: p.tasks_completed ?? 0,
          tasks_total: p.tasks_total ?? 0,
        }))
      );
      setTicketCount(openTickets ?? 0);
      setLoading(false);
    };

    fetch();
  }, [user]);

  const activeCount = projects.filter((p) => p.status !== "Completed").length;
  const completedTasks = projects.reduce((a, p) => a + p.tasks_completed, 0);
  const pendingTasks = projects.reduce((a, p) => a + (p.tasks_total - p.tasks_completed), 0);

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  return (
    <div>
      <div className="bg-gradient-primary rounded-2xl p-8 text-primary-foreground mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {firstName}! 👋</h1>
        <p className="opacity-90">Your projects are progressing well. Here's an overview of your current status.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Projects", value: String(activeCount), icon: FolderKanban, color: "text-primary", view: "projects" as PortalView },
          { label: "Pending Tasks", value: String(pendingTasks), icon: Clock, color: "text-warning" },
          { label: "Completed Tasks", value: String(completedTasks), icon: CheckCircle, color: "text-success" },
          { label: "Open Tickets", value: String(ticketCount), icon: AlertCircle, color: "text-destructive", view: "tickets" as PortalView },
        ].map((stat) => (
          <div
            key={stat.label}
            onClick={() => stat.view && onNavigate(stat.view)}
            className={cn("bg-card rounded-xl p-5 border border-border", stat.view && "cursor-pointer hover:border-primary/30 transition-colors")}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div className="text-2xl font-bold mb-1">{loading ? "—" : stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Your Projects</h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("projects")}>View All</Button>
          </div>
          <div className="p-5 space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : projects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No projects yet.</p>
            ) : (
              projects.map((project) => (
                <div key={project.name} className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium mb-1">{project.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due: {formatDate(project.due_date)}</span>
                        <span>{project.tasks_completed}/{project.tasks_total} tasks</span>
                      </div>
                    </div>
                    <Badge variant={project.status === "Completed" ? "default" : "secondary"} className={project.status === "Completed" ? "bg-success" : ""}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={project.progress} className="flex-1 h-2" />
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Recent Messages</h2>
          </div>
          <div className="p-5 text-sm text-muted-foreground text-center py-8">
            <p>Messages will appear here once connected.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalDashboard;
