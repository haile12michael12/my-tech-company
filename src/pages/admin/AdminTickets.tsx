import { useState, useEffect } from "react";
import {
  Search, MoreHorizontal, Trash2, AlertCircle, CheckCircle, Clock,
  MessageSquare,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Ticket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string | null;
  status: string | null;
  priority: string | null;
  category: string | null;
  client_id: string;
  created_at: string;
}

interface Profile {
  user_id: string;
  display_name: string | null;
  company: string | null;
}

const AdminTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [clients, setClients] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => { fetchTickets(); fetchClients(); }, []);

  const fetchTickets = async () => {
    const { data, error } = await supabase.from("tickets").select("*").order("created_at", { ascending: false });
    if (!error && data) setTickets(data);
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

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("tickets").update({ status }).eq("id", id);
    if (!error) { fetchTickets(); toast.success(`Ticket marked as ${status}`); }
  };

  const updatePriority = async (id: string, priority: string) => {
    const { error } = await supabase.from("tickets").update({ priority }).eq("id", id);
    if (!error) { fetchTickets(); toast.success(`Priority set to ${priority}`); }
  };

  const deleteTicket = async (id: string) => {
    const { error } = await supabase.from("tickets").delete().eq("id", id);
    if (!error) { fetchTickets(); toast.success("Ticket deleted"); }
  };

  const filtered = tickets.filter((t) => {
    const matchesSearch = t.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getClientName(t.client_id).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const openCount = tickets.filter((t) => t.status === "Open").length;
  const inProgressCount = tickets.filter((t) => t.status === "In Progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;

  return (
    <AdminLayout title="Support Tickets">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search tickets..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Open", value: openCount, icon: AlertCircle, color: "text-destructive" },
          { label: "In Progress", value: inProgressCount, icon: Clock, color: "text-warning" },
          { label: "Resolved", value: resolvedCount, icon: CheckCircle, color: "text-success" },
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
              <TableHead>Ticket</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No tickets found</TableCell></TableRow>
            ) : filtered.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <div><div className="font-medium font-mono text-sm">{ticket.ticket_number}</div>
                  <div className="text-sm">{ticket.subject}</div></div>
                </TableCell>
                <TableCell>{getClientName(ticket.client_id)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    ticket.priority === "High" && "border-destructive text-destructive",
                    ticket.priority === "Medium" && "border-warning text-warning",
                    ticket.priority === "Low" && "border-muted-foreground text-muted-foreground",
                  )}>{ticket.priority}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{ticket.category || "—"}</TableCell>
                <TableCell>
                  <Badge className={cn(
                    ticket.status === "Open" && "bg-destructive",
                    ticket.status === "In Progress" && "bg-warning",
                    ticket.status === "Resolved" && "bg-success",
                    ticket.status === "Closed" && "bg-muted text-muted-foreground",
                  )}>{ticket.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => updateStatus(ticket.id, "Open")}>Mark Open</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(ticket.id, "In Progress")}>Mark In Progress</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(ticket.id, "Resolved")}>Mark Resolved</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(ticket.id, "Closed")}>Mark Closed</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => updatePriority(ticket.id, "High")}>Set High Priority</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updatePriority(ticket.id, "Medium")}>Set Medium Priority</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updatePriority(ticket.id, "Low")}>Set Low Priority</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteTicket(ticket.id)}>
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

export default AdminTickets;
