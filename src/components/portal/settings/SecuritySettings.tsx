import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const ToggleRow = ({ label, description, checked, onToggle }: { label: string; description: string; checked: boolean; onToggle: () => void }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onToggle} />
  </div>
);

const SecuritySettings = ({ onSave }: { onSave: () => void }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionAlerts, setSessionAlerts] = useState(true);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const handlePasswordSubmit = (_data: PasswordFormValues) => {
    onSave();
    form.reset();
  };

  const sessions = [
    { device: "Chrome on macOS", location: "Addis Ababa, Ethiopia", lastActive: "Active now", current: true },
    { device: "Safari on iPhone", location: "Addis Ababa, Ethiopia", lastActive: "2 hours ago", current: false },
    { device: "Firefox on Windows", location: "New York, USA", lastActive: "3 days ago", current: false },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePasswordSubmit)} className="space-y-4 max-w-md">
              <FormField control={form.control} name="currentPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showCurrent ? "text" : "password"} placeholder="Enter current password" {...field} />
                      <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="newPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showNew ? "text" : "password"} placeholder="Enter new password" {...field} />
                      <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters with one uppercase and one number.</p>
                </FormItem>
              )} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl><Input type="password" placeholder="Re-enter new password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="gap-2"><Save className="w-4 h-4" /> Update Password</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow label="Enable 2FA" description="Require a verification code when signing in" checked={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
          <Separator />
          <ToggleRow label="Login Alerts" description="Get notified of new sign-ins from unrecognized devices" checked={sessionAlerts} onToggle={() => setSessionAlerts(!sessionAlerts)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Devices currently signed in to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">{s.device}</p>
                <p className="text-xs text-muted-foreground">{s.location} · {s.lastActive}</p>
              </div>
              {s.current ? (
                <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">Current</span>
              ) : (
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Revoke</Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
