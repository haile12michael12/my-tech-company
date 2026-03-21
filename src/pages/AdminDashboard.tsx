import {
  FolderKanban,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  UserPlus,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
  Globe,
  FileText,
  CreditCard,
  Mail,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Total Revenue",
    value: "$124,500",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "Active Projects",
    value: "24",
    change: "+3",
    trend: "up",
    icon: FolderKanban,
  },
  {
    label: "New Leads",
    value: "156",
    change: "+24.5%",
    trend: "up",
    icon: UserPlus,
  },
  {
    label: "Website Visitors",
    value: "12.5K",
    change: "-2.3%",
    trend: "down",
    icon: Eye,
  },
];

const recentLeads = [
  {
    name: "Abebe Kebede",
    email: "abebe@example.com",
    company: "Ethiopian Coffee Co.",
    service: "Web Development",
    status: "New",
    date: "Today",
  },
  {
    name: "Sarah Johnson",
    email: "sarah@globalfinance.com",
    company: "Global Finance Corp",
    service: "Mobile App",
    status: "Contacted",
    date: "Yesterday",
  },
  {
    name: "Mohammed Ali",
    email: "mali@logistics.et",
    company: "Fast Logistics",
    service: "Cloud Solutions",
    status: "Qualified",
    date: "Jan 15",
  },
  {
    name: "Helen Tadesse",
    email: "helen@healthplus.com",
    company: "Health Plus",
    service: "AI Integration",
    status: "New",
    date: "Jan 14",
  },
];

const recentProjects = [
  { name: "E-commerce Platform", client: "Retail Corp", progress: 75, status: "Active" },
  { name: "Banking Mobile App", client: "Unity Bank", progress: 45, status: "Active" },
  { name: "CRM Integration", client: "Sales Pro", progress: 100, status: "Completed" },
  { name: "Analytics Dashboard", client: "Data Inc", progress: 30, status: "Active" },
];

const AdminDashboard = () => {
  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl p-5 border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  stat.trend === "up" ? "text-success" : "text-destructive"
                )}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Recent Leads</h2>
            <Button size="sm" className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-1" />
              Add Lead
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLeads.map((lead) => (
                <TableRow key={lead.email}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-muted-foreground">{lead.company}</div>
                    </div>
                  </TableCell>
                  <TableCell>{lead.service}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        lead.status === "New"
                          ? "default"
                          : lead.status === "Qualified"
                          ? "secondary"
                          : "outline"
                      }
                      className={lead.status === "Qualified" ? "bg-success" : ""}
                    >
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{lead.date}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4 border-t border-border">
            <Button variant="ghost" className="w-full text-primary">
              View All Leads
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Projects Overview */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Active Projects</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="p-4 space-y-4">
            {recentProjects.map((project) => (
              <div
                key={project.name}
                className="p-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">{project.name}</div>
                  <Badge
                    variant={project.status === "Completed" ? "default" : "secondary"}
                    className={cn(
                      "text-xs",
                      project.status === "Completed" && "bg-success"
                    )}
                  >
                    {project.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-2">{project.client}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid md:grid-cols-4 gap-4">
        {[
          { label: "Edit Homepage", icon: Globe, color: "from-blue-500 to-cyan-500" },
          { label: "New Blog Post", icon: FileText, color: "from-purple-500 to-pink-500" },
          { label: "Create Invoice", icon: CreditCard, color: "from-green-500 to-emerald-500" },
          { label: "Send Email", icon: Mail, color: "from-orange-500 to-red-500" },
        ].map((action) => (
          <button
            key={action.label}
            className="bg-card rounded-xl p-5 border border-border hover:shadow-lg hover:border-primary/20 transition-all text-left group"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br",
                action.color
              )}
            >
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <div className="font-medium group-hover:text-primary transition-colors">
              {action.label}
            </div>
          </button>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
