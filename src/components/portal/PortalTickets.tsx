import { useEffect, useState } from "react";
import { Plus, Clock, CheckCircle, AlertCircle, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Ticket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string | null;
  category: string | null;
  priority: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

const priorityColors: Record<string, string> = {
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
  High: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Low: "bg-muted text-muted-foreground border-border",
};

const statusIcons: Record<string, any> = {
  Open: AlertCircle,
  "In Progress": Clock,
  Resolved: CheckCircle,
};

const statusColors: Record<string, string> = {
  Open: "text-destructive",
  "In Progress": "text-warning",
  Resolved: "text-success",
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const timeAgo = (d: string) => {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
};

const PortalTickets = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: "", description: "", category: "Bug", priority: "Medium" });

  const loadTickets = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("tickets")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });
    setTickets(data || []);
    setLoading(false);
  };

  useEffect(() => { loadTickets(); }, [user]);

  const handleSubmit = async () => {
    if (!user || !form.subject.trim()) return;
    setSubmitting(true);
    const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`;
    const { error } = await supabase.from("tickets").insert({
      client_id: user.id,
      ticket_number: ticketNumber,
      subject: form.subject.trim(),
      description: form.description.trim() || null,
      category: form.category,
      priority: form.priority,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: "Failed to create ticket.", variant: "destructive" });
      return;
    }
    toast({ title: "Ticket created", description: `${ticketNumber} has been submitted.` });
    setForm({ subject: "", description: "", category: "Bug", priority: "Medium" });
    setDialogOpen(false);
    loadTickets();
  };

  const filtered = filter === "all"
    ? tickets
    : tickets.filter((t) => (t.status || "Open").toLowerCase().replace(" ", "-") === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">Submit and track your support requests.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />New Ticket</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Support Ticket</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Subject</Label>
                <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Brief summary of the issue" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Provide details…" rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Bug", "Feature Request", "Question", "Other"].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Low", "Medium", "High", "Critical"].map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full" onClick={handleSubmit} disabled={submitting || !form.subject.trim()}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Submit Ticket
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {["all", "open", "in-progress", "resolved"].map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
            {f.replace("-", " ")}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No tickets found.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((ticket) => {
            const status = ticket.status || "Open";
            const StatusIcon = statusIcons[status] || AlertCircle;
            return (
              <Card key={ticket.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusIcon className={cn("w-5 h-5", statusColors[status])} />
                        <span className="font-semibold">{ticket.subject}</span>
                        <span className="text-xs text-muted-foreground">{ticket.ticket_number}</span>
                      </div>
                      {ticket.description && (
                        <p className="text-sm text-muted-foreground mb-3 ml-8">{ticket.description}</p>
                      )}
                      <div className="flex items-center gap-4 ml-8 text-xs text-muted-foreground">
                        {ticket.category && <span>{ticket.category}</span>}
                        <span>Created: {formatDate(ticket.created_at)}</span>
                        <span>Updated: {timeAgo(ticket.updated_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className={cn(priorityColors[ticket.priority || "Medium"])}>{ticket.priority || "Medium"}</Badge>
                      <Badge variant="outline">{status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PortalTickets;
