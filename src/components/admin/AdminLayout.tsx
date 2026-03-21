import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Mail,
  CreditCard,
  Settings,
  BarChart3,
  Globe,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const sidebarSections = [
  {
    title: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
      { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    ],
  },
  {
    title: "Content",
    items: [
      { icon: Globe, label: "Website CMS", href: "/admin/cms" },
      { icon: FileText, label: "Blog Posts", href: "/admin/blog" },
      { icon: FolderKanban, label: "Portfolio", href: "/admin/portfolio" },
    ],
  },
  {
    title: "Business",
    items: [
      { icon: Users, label: "Users", href: "/admin/users", badge: 12 },
      { icon: Mail, label: "Leads", href: "/admin/leads", badge: 5 },
      { icon: FolderKanban, label: "Projects", href: "/admin/projects" },
      { icon: CreditCard, label: "Invoices", href: "/admin/invoices" },
      { icon: Mail, label: "Tickets", href: "/admin/tickets" },
    ],
  },
  {
    title: "System",
    items: [
      { icon: Settings, label: "Settings", href: "/admin/settings" },
    ],
  },
];

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 overflow-y-auto">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">N</span>
            </div>
            <div>
              <span className="text-lg font-bold">NovaTech</span>
              <div className="text-xs text-muted-foreground">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Nav Sections */}
        <nav className="p-4">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-6">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left text-sm",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 h-9" />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-medium">
                AD
              </div>
              <div>
                <div className="text-sm font-medium">Admin User</div>
                <div className="text-xs text-muted-foreground">Super Admin</div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
