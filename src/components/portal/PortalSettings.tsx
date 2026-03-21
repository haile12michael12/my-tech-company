import { useState } from "react";
import { User, Bell, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import ProfileSettings from "./settings/ProfileSettings";
import NotificationSettings from "./settings/NotificationSettings";
import SecuritySettings from "./settings/SecuritySettings";

type SettingsTab = "profile" | "notifications" | "security";

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

const PortalSettings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="flex gap-6">
        <nav className="w-52 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 min-w-0">
          {activeTab === "profile" && <ProfileSettings onSave={() => toast({ title: "Profile updated", description: "Your profile changes have been saved." })} />}
          {activeTab === "notifications" && <NotificationSettings onSave={() => toast({ title: "Preferences saved", description: "Your notification preferences have been updated." })} />}
          {activeTab === "security" && <SecuritySettings onSave={() => toast({ title: "Security updated", description: "Your security settings have been saved." })} />}
        </div>
      </div>
    </div>
  );
};

export default PortalSettings;
