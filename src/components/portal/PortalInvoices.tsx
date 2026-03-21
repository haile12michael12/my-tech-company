import { useEffect, useState } from "react";
import { Download, Eye, CreditCard, DollarSign, Clock, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Invoice {
  id: string;
  invoice_number: string;
  project_name: string | null;
  amount: number;
  issued_date: string;
  due_date: string;
  status: string | null;
}

const statusConfig: Record<string, { color: string; icon: any }> = {
  Paid: { color: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  Pending: { color: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  Overdue: { color: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertTriangle },
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const PortalInvoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("invoices")
        .select("*")
        .eq("client_id", user.id)
        .order("issued_date", { ascending: false });
      setInvoices(data || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const totalOutstanding = invoices
    .filter((i) => i.status === "Pending" || i.status === "Overdue")
    .reduce((s, i) => s + i.amount, 0);
  const totalPaid = invoices
    .filter((i) => i.status === "Paid")
    .reduce((s, i) => s + i.amount, 0);
  const thisMonth = invoices.filter((i) => {
    const d = new Date(i.issued_date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">View and manage all your billing and payment history.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Outstanding", value: formatCurrency(totalOutstanding), icon: DollarSign, color: "text-warning" },
          { label: "Total Paid", value: formatCurrency(totalPaid), icon: CheckCircle, color: "text-success" },
          { label: "Invoices This Month", value: String(thisMonth), icon: CreditCard, color: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-5 border border-border">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div className="text-2xl font-bold mb-1">{loading ? "—" : stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">No invoices yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => {
                const config = statusConfig[inv.status || "Pending"];
                const StatusIcon = config?.icon || Clock;
                return (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.invoice_number}</TableCell>
                    <TableCell>{inv.project_name || "—"}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(inv.amount)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(inv.issued_date)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(inv.due_date)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("gap-1", config?.color)}>
                        <StatusIcon className="w-3 h-3" />
                        {inv.status || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" title="View"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" title="Download"><Download className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default PortalInvoices;
