import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ToggleRow = ({ label, description, checked, onToggle }: { label: string; description: string; checked: boolean; onToggle: () => void }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onToggle} />
  </div>
);

const NotificationSettings = ({ onSave }: { onSave: () => void }) => {
  const [prefs, setPrefs] = useState({
    emailProjectUpdates: true,
    emailMessages: true,
    emailInvoices: true,
    emailMarketing: false,
    pushProjectUpdates: true,
    pushMessages: true,
    pushTickets: true,
    pushInvoices: false,
    digestFrequency: "daily",
  });

  const toggle = (key: string) => setPrefs((p) => ({ ...p, [key]: !p[key as keyof typeof p] }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Choose which emails you'd like to receive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow label="Project Updates" description="Status changes, milestone completions" checked={prefs.emailProjectUpdates} onToggle={() => toggle("emailProjectUpdates")} />
          <Separator />
          <ToggleRow label="Messages" description="New messages from your team" checked={prefs.emailMessages} onToggle={() => toggle("emailMessages")} />
          <Separator />
          <ToggleRow label="Invoices & Billing" description="New invoices and payment confirmations" checked={prefs.emailInvoices} onToggle={() => toggle("emailInvoices")} />
          <Separator />
          <ToggleRow label="Marketing & Tips" description="Product updates and best practices" checked={prefs.emailMarketing} onToggle={() => toggle("emailMarketing")} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Real-time alerts in your browser.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow label="Project Updates" description="Instant alerts on project changes" checked={prefs.pushProjectUpdates} onToggle={() => toggle("pushProjectUpdates")} />
          <Separator />
          <ToggleRow label="Messages" description="New chat message notifications" checked={prefs.pushMessages} onToggle={() => toggle("pushMessages")} />
          <Separator />
          <ToggleRow label="Support Tickets" description="Ticket status updates" checked={prefs.pushTickets} onToggle={() => toggle("pushTickets")} />
          <Separator />
          <ToggleRow label="Invoices" description="Payment due reminders" checked={prefs.pushInvoices} onToggle={() => toggle("pushInvoices")} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Digest Frequency</CardTitle>
          <CardDescription>How often you receive summary emails.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={prefs.digestFrequency} onValueChange={(v) => setPrefs((p) => ({ ...p, digestFrequency: v }))}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Real-time</SelectItem>
              <SelectItem value="daily">Daily Digest</SelectItem>
              <SelectItem value="weekly">Weekly Digest</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} className="gap-2"><Save className="w-4 h-4" /> Save Preferences</Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
