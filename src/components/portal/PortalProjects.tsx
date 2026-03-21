import { useEffect, useState } from "react";
import { Calendar, CheckCircle, Clock, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectMember {
  id: string;
  name: string;
  role: string | null;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  progress: number | null;
  status: string | null;
  phase: string | null;
  due_date: string | null;
  start_date: string | null;
  tasks_completed: number | null;
  tasks_total: number | null;
  recent_update: string | null;
  members: ProjectMember[];
}

const PortalProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      const { data: projectsData } = await supabase
        .from("projects")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (!projectsData || projectsData.length === 0) {
        setProjects([]);
        setLoading(false);
        return;
      }

      const projectIds = projectsData.map((p) => p.id);
      const { data: membersData } = await supabase
        .from("project_members")
        .select("*")
        .in("project_id", projectIds);

      const projectsWithMembers: Project[] = projectsData.map((p) => ({
        ...p,
        members: (membersData || []).filter((m) => m.project_id === p.id),
      }));

      setProjects(projectsWithMembers);
      setLoading(false);
    };

    fetchProjects();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Track progress and status of all your active projects.</p>
          </div>
        </div>
        <Card className="py-16 text-center">
          <CardContent>
            <p className="text-muted-foreground">No projects yet. Your projects will appear here once they're created.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Track progress and status of all your active projects.</p>
        </div>
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:border-primary/30 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {project.phase && <Badge variant="outline">{project.phase}</Badge>}
                  <Badge
                    variant={project.status === "Completed" ? "default" : "secondary"}
                    className={project.status === "Completed" ? "bg-success" : ""}
                  >
                    {project.status || "In Progress"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Progress value={project.progress ?? 0} className="flex-1 h-2.5" />
                <span className="text-sm font-semibold w-12 text-right">{project.progress ?? 0}%</span>
              </div>

              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {formatDate(project.due_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4" />
                  <span>{project.tasks_completed ?? 0}/{project.tasks_total ?? 0} tasks done</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{project.members.length} team members</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Started: {formatDate(project.start_date)}</span>
                </div>
              </div>

              {project.recent_update && (
                <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm">
                    <span className="font-medium">Latest Update:</span> {project.recent_update}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PortalProjects;
