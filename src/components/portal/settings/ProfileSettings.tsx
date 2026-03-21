import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const profileSchema = z.object({
  displayName: z.string().trim().min(1, "Display name is required").max(100),
  email: z.string().trim().email("Enter a valid email address"),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  timezone: z.string(),
  language: z.string(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileSettings = ({ onSave }: { onSave: () => void }) => {
  const { user, profile, refreshProfile } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      email: "",
      company: "",
      timezone: "America/New_York",
      language: "en",
    },
  });

  useEffect(() => {
    if (profile && user) {
      form.reset({
        displayName: profile.display_name || "",
        email: user.email || "",
        company: profile.company || "",
        timezone: "America/New_York",
        language: "en",
      });
    }
  }, [profile, user, form]);

  const handleSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: data.displayName,
        company: data.company || null,
      })
      .eq("user_id", user.id);

    if (!error) {
      await refreshProfile();
      onSave();
    }
  };

  const initials = profile?.display_name
    ? profile.display_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details and contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <button type="button" className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium">Profile Photo</p>
                <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField control={form.control} name="displayName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl><Input type="email" {...field} disabled /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="company" render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField control={form.control} name="timezone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">GMT (London)</SelectItem>
                      <SelectItem value="Africa/Addis_Ababa">East Africa Time (EAT)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="language" render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="am">Amharic</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="gap-2" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileSettings;
