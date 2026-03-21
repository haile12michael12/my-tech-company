import { useState, useEffect } from "react";
import {
  Plus, Search, MoreHorizontal, Trash2, Edit, Eye, FolderKanban,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  client_id: string;
  description: string | null;
  status: string | null;
  phase: string | null;
  progress: number | null;
  start_date: string | null;
  due_date: string | null;
  tasks_completed: number | null;
  tasks_total: number | null;
}

interface Profile {
  user_id: string;
  display_name: string | null;
  company: string | null;
}

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Profile[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form
  const [selectedClient, setSelectedClient] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phase, setPhase] = useState("Planning");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit
  const [editProject, setEditProject] = useState<Project | null>(null);

  useEffect(() => { fetchProjects(); fetchClients(); }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (!error && data) setProjects(data);
    setLoading(false);
  };

  const fetchClients = async () => {
    const { data } = await supabase.from("profiles").select("user_id, display_name, company");
    if (data) setClients(data);
  };

  const getClientName = (clientId: string) => {
    const c = clients.find((p) => p.user_id === clientId);
    return c?.display_name || c?.company || clientId.slice(0, 8);
  };

  const handleCreate = async () => {
    if (!selectedClient || !name) { toast.error("Client and project name are required"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("projects").insert({
      client_id: selectedClient,
      name,
      description: description || null,
      phase,
      start_date: startDate || null,
      due_date: dueDate || null,
      status: "In Progress",
      progress: 0,
      tasks_completed: 0,
      tasks_total: 0,
    });
    if (error) { toast.error("Failed to create project"); }
    else { toast.success("Project created"); setIsCreateOpen(false); resetForm(); fetchProjects(); }
    setSubmitting(false);
  };

  const resetForm = () => {
    setSelectedClient(""); setName(""); setDescription(""); setPhase("Planning"); setStartDate(""); setDueDate("");
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("projects").update({ status }).eq("id", id);
    if (!error) { fetchProjects(); toast.success(`Project marked as ${status}`); }
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) { fetchProjects(); toast.success("Project deleted"); }
  };

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getClientName(p.client_id).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status?.toLowerCase().replace(/\s+/g, "-") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = projects.filter((p) => p.status === "In Progress").length;
  const completedCount = projects.filter((p) => p.status === "Completed").length;

  return (
    <AdminLayout title="Projects">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search projects..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary"><Plus className="w-4 h-4 mr-2" />New Project</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create New Project</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.user_id} value={c.user_id}>{c.display_name || c.company || c.user_id.slice(0, 8)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Project Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" /></div>
              <div className="space-y-2">
                <Label>Phase</Label>
                <Select value={phase} onValueChange={setPhase}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Planning", "Design", "Development", "Testing", "Deployment"].map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
                <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button className="bg-gradient-primary" disabled={submitting} onClick={handleCreate}>Create Project</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Projects", value: projects.length, icon: FolderKanban, color: "text-primary" },
          { label: "Active", value: activeCount, icon: FolderKanban, color: "text-success" },
          { label: "Completed", value: completedCount, icon: FolderKanban, color: "text-muted-foreground" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-4 border border-border flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-lg bg-muted flex items-center justify-center", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No projects found</TableCell></TableRow>
            ) : filtered.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div><div className="font-medium">{project.name}</div>
                  {project.description && <div className="text-sm text-muted-foreground truncate max-w-[200px]">{project.description}</div>}</div>
                </TableCell>
                <TableCell>{getClientName(project.client_id)}</TableCell>
                <TableCell><Badge variant="outline">{project.phase}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden w-20">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress || 0}%` }} />
                    </div>
                    <span className="text-xs font-medium">{project.progress || 0}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cn(
                    project.status === "In Progress" && "bg-primary",
                    project.status === "Completed" && "bg-success",
                    project.status === "On Hold" && "bg-warning",
                  )}>{project.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{project.due_date || "—"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => updateStatus(project.id, "In Progress")}>Mark In Progress</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(project.id, "Completed")}>Mark Completed</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(project.id, "On Hold")}>Mark On Hold</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteProject(project.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
