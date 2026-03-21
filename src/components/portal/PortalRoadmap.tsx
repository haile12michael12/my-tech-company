import { useState, useEffect } from "react";
import { CheckCircle, Circle, Clock, ArrowRight, Milestone, Loader2, FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface MilestoneRecord {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  target_date: string | null;
  sort_order: number | null;
  project_id: string;
  project_name?: string;
}

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string; label: string }> = {
  completed: { icon: CheckCircle, color: "text-success", bg: "bg-success/10 border-success/20", label: "Completed" },
  "in-progress": { icon: Clock, color: "text-primary", bg: "bg-primary/10 border-primary/20", label: "In Progress" },
  upcoming: { icon: Circle, color: "text-muted-foreground", bg: "bg-muted border-border", label: "Upcoming" },
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "TBD";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const PortalRoadmap = () => {
  const { user } = useAuth();
  const [grouped, setGrouped] = useState<{ project: string; items: MilestoneRecord[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;

      // Get user's projects first
      const { data: projects } = await supabase
        .from("projects")
        .select("id, name")
        .eq("client_id", user.id);

      if (!projects || projects.length === 0) {
        setGrouped([]);
        setLoading(false);
        return;
      }

      const projectIds = projects.map((p) => p.id);
      const projectMap = Object.fromEntries(projects.map((p) => [p.id, p.name]));

      const { data: milestones, error } = await supabase
        .from("roadmap_milestones")
        .select("*")
        .in("project_id", projectIds)
        .order("sort_order", { ascending: true });

      if (error) {
        toast.error("Failed to load roadmap");
        setLoading(false);
        return;
      }

      // Group by project
      const map = new Map<string, MilestoneRecord[]>();
      (milestones || []).forEach((m) => {
        const name = projectMap[m.project_id] || "Unknown Project";
        if (!map.has(name)) map.set(name, []);
        map.get(name)!.push({ ...m, project_name: name });
      });

      setGrouped(Array.from(map.entries()).map(([project, items]) => ({ project, items })));
      setLoading(false);
    };

    fetch();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (grouped.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Project Roadmap</h1>
          <p className="text-muted-foreground">See what's been delivered, what we're working on, and what's coming next.</p>
        </div>
        <div className="text-center py-16 text-muted-foreground">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No roadmap milestones yet</p>
          <p className="text-sm">Milestones will appear here once your projects have them.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Project Roadmap</h1>
        <p className="text-muted-foreground">See what's been delivered, what we're working on, and what's coming next.</p>
      </div>

      <div className="flex items-center gap-4 mb-8">
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={key} className="flex items-center gap-2 text-sm">
              <Icon className={cn("w-4 h-4", cfg.color)} />
              <span className="text-muted-foreground">{cfg.label}</span>
            </div>
          );
        })}
      </div>

      <div className="space-y-10">
        {grouped.map((group) => (
          <div key={group.project}>
            <div className="flex items-center gap-2 mb-5">
              <Milestone className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">{group.project}</h2>
            </div>

            <div className="relative">
              <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />

              <div className="space-y-6">
                {group.items.map((item) => {
                  const status = item.status || "upcoming";
                  const cfg = statusConfig[status] || statusConfig.upcoming;
                  return (
                    <div key={item.id} className="relative pl-12">
                      <div className={cn("absolute left-2.5 top-1 w-4 h-4 rounded-full border-2 bg-background z-10",
                        status === "completed" ? "border-success bg-success" :
                        status === "in-progress" ? "border-primary bg-primary" : "border-border"
                      )} />

                      <Card className={cn("border", status === "in-progress" && "border-primary/30 shadow-sm")}>
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{item.title}</h3>
                              {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs text-muted-foreground">{formatDate(item.target_date)}</span>
                              <Badge variant="outline" className={cn(cfg.bg, cfg.color)}>{cfg.label}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortalRoadmap;
