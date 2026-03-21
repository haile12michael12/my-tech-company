import { useState, useEffect } from "react";
import {
  Plus, Search, Download, Send, Eye, MoreHorizontal,
  DollarSign, Clock, CheckCircle, AlertCircle, FileText,
  Printer, Trash2,
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

interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  project_name: string | null;
  amount: number;
  status: string | null;
  due_date: string;
  issued_date: string;
}

interface Profile {
  user_id: string;
  display_name: string | null;
  company: string | null;
}

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Profile[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form state
  const [selectedClient, setSelectedClient] = useState("");
  const [projectName, setProjectName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [issuedDate, setIssuedDate] = useState(new Date().toISOString().split("T")[0]);
  const [lineItems, setLineItems] = useState([{ description: "", quantity: 1, rate: 0 }]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, []);

  const fetchInvoices = async () => {
    const { data, error } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });
    if (!error && data) setInvoices(data);
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

  const subtotal = lineItems.reduce((s, i) => s + i.quantity * i.rate, 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const handleCreate = async (isDraft: boolean) => {
    if (!selectedClient || !dueDate) {
      toast.error("Please select a client and due date");
      return;
    }
    setSubmitting(true);
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, "0")}`;
    const { error } = await supabase.from("invoices").insert({
      invoice_number: invoiceNumber,
      client_id: selectedClient,
      project_name: projectName || null,
      amount: total,
      status: isDraft ? "Draft" : "Pending",
      due_date: dueDate,
      issued_date: issuedDate,
    });
    if (error) {
      toast.error("Failed to create invoice");
    } else {
      toast.success("Invoice created");
      setIsCreateOpen(false);
      resetForm();
      fetchInvoices();
    }
    setSubmitting(false);
  };

  const resetForm = () => {
    setSelectedClient("");
    setProjectName("");
    setDueDate("");
    setLineItems([{ description: "", quantity: 1, rate: 0 }]);
    setNotes("");
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("invoices").update({ status }).eq("id", id);
    if (!error) { fetchInvoices(); toast.success(`Invoice marked as ${status}`); }
  };

  const deleteInvoice = async (id: string) => {
    const { error } = await supabase.from("invoices").delete().eq("id", id);
    if (!error) { fetchInvoices(); toast.success("Invoice deleted"); }
  };

  const filtered = invoices.filter((inv) => {
    const matchesSearch = inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.project_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      getClientName(inv.client_id).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPaid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter((i) => i.status === "Pending").reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);

  return (
    <AdminLayout title="Invoices">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search invoices..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary"><Plus className="w-4 h-4 mr-2" />Create Invoice</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create New Invoice</DialogTitle></DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                      <SelectContent>
                        {clients.map((c) => (
                          <SelectItem key={c.user_id} value={c.user_id}>
                            {c.display_name || c.company || c.user_id.slice(0, 8)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Project</Label>
                    <Input placeholder="Project name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Issue Date</Label>
                      <Input type="date" value={issuedDate} onChange={(e) => setIssuedDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Line Items</Label>
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-sm font-medium">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Rate</div>
                    <div className="col-span-2 text-right">Amount</div>
                  </div>
                  {lineItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 p-3 border-t border-border items-center">
                      <div className="col-span-6">
                        <Input placeholder="Service description" value={item.description}
                          onChange={(e) => { const n = [...lineItems]; n[index].description = e.target.value; setLineItems(n); }} />
                      </div>
                      <div className="col-span-2">
                        <Input type="number" min="1" value={item.quantity} className="text-center"
                          onChange={(e) => { const n = [...lineItems]; n[index].quantity = Number(e.target.value); setLineItems(n); }} />
                      </div>
                      <div className="col-span-2">
                        <Input type="number" min="0" value={item.rate} className="text-right"
                          onChange={(e) => { const n = [...lineItems]; n[index].rate = Number(e.target.value); setLineItems(n); }} />
                      </div>
                      <div className="col-span-2 text-right font-medium">${(item.quantity * item.rate).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={() => setLineItems([...lineItems, { description: "", quantity: 1, rate: 0 }])}>
                  <Plus className="w-4 h-4 mr-1" />Add Line Item
                </Button>
              </div>

              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax (15%)</span><span>${tax.toLocaleString()}</span></div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border"><span>Total</span><span>${total.toLocaleString()}</span></div>
                </div>
              </div>

              <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Payment terms..." value={notes} onChange={(e) => setNotes(e.target.value)} /></div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <div className="flex gap-2">
                  <Button variant="outline" disabled={submitting} onClick={() => handleCreate(true)}>
                    <FileText className="w-4 h-4 mr-2" />Save as Draft
                  </Button>
                  <Button className="bg-gradient-primary" disabled={submitting} onClick={() => handleCreate(false)}>
                    <Send className="w-4 h-4 mr-2" />Send Invoice
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Paid", value: `$${totalPaid.toLocaleString()}`, icon: CheckCircle, color: "text-success" },
          { label: "Pending", value: `$${totalPending.toLocaleString()}`, icon: Clock, color: "text-warning" },
          { label: "Overdue", value: `$${totalOverdue.toLocaleString()}`, icon: AlertCircle, color: "text-destructive" },
          { label: "Total Invoices", value: String(invoices.length), icon: DollarSign, color: "text-primary" },
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
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No invoices found</TableCell></TableRow>
            ) : filtered.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div><div className="font-medium font-mono">{invoice.invoice_number}</div>
                  <div className="text-sm text-muted-foreground">{invoice.project_name}</div></div>
                </TableCell>
                <TableCell>{getClientName(invoice.client_id)}</TableCell>
                <TableCell><div className="font-semibold">${invoice.amount.toLocaleString()}</div></TableCell>
                <TableCell>
                  <Badge className={cn(
                    invoice.status === "Paid" && "bg-success",
                    invoice.status === "Pending" && "bg-warning",
                    invoice.status === "Overdue" && "bg-destructive",
                    invoice.status === "Draft" && "bg-muted text-muted-foreground",
                  )}>{invoice.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{invoice.due_date}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => updateStatus(invoice.id, "Paid")}><CheckCircle className="w-4 h-4 mr-2" />Mark Paid</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(invoice.id, "Pending")}><Send className="w-4 h-4 mr-2" />Mark Pending</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(invoice.id, "Overdue")}><AlertCircle className="w-4 h-4 mr-2" />Mark Overdue</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteInvoice(invoice.id)}>
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

export default AdminInvoices;
