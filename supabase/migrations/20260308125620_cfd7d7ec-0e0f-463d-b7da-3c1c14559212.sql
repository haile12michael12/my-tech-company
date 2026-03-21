
-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ==================== PROFILES ====================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  company TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'client',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================== PROJECTS ====================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT DEFAULT 'In Progress',
  phase TEXT DEFAULT 'Planning',
  due_date DATE,
  start_date DATE,
  tasks_completed INTEGER DEFAULT 0,
  tasks_total INTEGER DEFAULT 0,
  recent_update TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view own projects" ON public.projects FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Clients can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = client_id);

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== PROJECT TEAM MEMBERS ====================
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT
);
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members visible to project owner" ON public.project_members FOR SELECT
USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_id = auth.uid()));

-- ==================== INVOICES ====================
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  project_name TEXT,
  amount NUMERIC(10,2) NOT NULL,
  issued_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending', 'Overdue')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view own invoices" ON public.invoices FOR SELECT USING (auth.uid() = client_id);

-- ==================== TICKETS ====================
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_number TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view own tickets" ON public.tickets FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Clients can create tickets" ON public.tickets FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients can update own tickets" ON public.tickets FOR UPDATE USING (auth.uid() = client_id);

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== CONVERSATIONS & MESSAGES ====================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  last_message TEXT,
  last_message_at TIMESTAMPTZ DEFAULT now(),
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view own conversations" ON public.conversations FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Clients can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients can update own conversations" ON public.conversations FOR UPDATE USING (auth.uid() = client_id);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in own conversations" ON public.messages FOR SELECT
USING (EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND client_id = auth.uid()));
CREATE POLICY "Users can send messages to own conversations" ON public.messages FOR INSERT
WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND client_id = auth.uid()));

CREATE TABLE public.message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view reactions in own conversations" ON public.message_reactions FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.messages m JOIN public.conversations c ON c.id = m.conversation_id
  WHERE m.id = message_id AND c.client_id = auth.uid()
));
CREATE POLICY "Users can add reactions" ON public.message_reactions FOR INSERT
WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own reactions" ON public.message_reactions FOR DELETE
USING (auth.uid() = user_id);

-- ==================== FILES ====================
CREATE TABLE public.project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name TEXT,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size TEXT,
  storage_path TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view own files" ON public.project_files FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Clients can upload files" ON public.project_files FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients can delete own files" ON public.project_files FOR DELETE USING (auth.uid() = client_id);

-- ==================== ROADMAP ====================
CREATE TABLE public.roadmap_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('completed', 'in-progress', 'upcoming')),
  target_date DATE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.roadmap_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view own milestones" ON public.roadmap_milestones FOR SELECT
USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_id = auth.uid()));

-- ==================== STORAGE BUCKET ====================
INSERT INTO storage.buckets (id, name, public) VALUES ('portal-files', 'portal-files', false);

CREATE POLICY "Clients can view own files in storage" ON storage.objects FOR SELECT
USING (bucket_id = 'portal-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Clients can upload own files to storage" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portal-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Clients can delete own files in storage" ON storage.objects FOR DELETE
USING (bucket_id = 'portal-files' AND auth.uid()::text = (storage.foldername(name))[1]);
