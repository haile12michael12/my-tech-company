import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  LifeBuoy,
  Map,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export type PortalView = "dashboard" | "projects" | "files" | "messages" | "invoices" | "tickets" | "roadmap" | "settings";

const sidebarItems: { icon: any; label: string; view: PortalView; badge?: number }[] = [
  { icon: LayoutDashboard, label: "Dashboard", view: "dashboard" },
  { icon: FolderKanban, label: "Projects", view: "projects" },
  { icon: FileText, label: "Files", view: "files" },
  { icon: MessageSquare, label: "Messages", view: "messages", badge: 3 },
  { icon: CreditCard, label: "Invoices", view: "invoices" },
  { icon: LifeBuoy, label: "Support Tickets", view: "tickets" },
  { icon: Map, label: "Roadmap", view: "roadmap" },
  { icon: Settings, label: "Settings", view: "settings" },
];

interface PortalSidebarProps {
  activeView: PortalView;
  onViewChange: (view: PortalView) => void;
  open: boolean;
}

const PortalSidebar = ({ activeView, onViewChange, open }: PortalSidebarProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-card border-r border-border z-50 transition-all duration-300",
        open ? "w-64" : "w-20"
      )}
    >
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-primary-foreground">N</span>
          </div>
          {open && (
            <span className="text-lg font-bold">
              Nova<span className="text-primary">Tech</span>
            </span>
          )}
        </Link>
      </div>

      <nav className="p-4 space-y-1">
        {sidebarItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
              activeView === item.view
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {open && (
              <>
                <span className="flex-1 text-sm">{item.label}</span>
                {item.badge && (
                  <Badge className="bg-destructive text-destructive-foreground h-5 px-1.5">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {open && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default PortalSidebar;
