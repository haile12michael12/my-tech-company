
-- Create app_role enum and user_roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS on user_roles: admins can view all, users can view own
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for invoices
CREATE POLICY "Admins can view all invoices" ON public.invoices
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert invoices" ON public.invoices
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update invoices" ON public.invoices
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete invoices" ON public.invoices
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for projects
CREATE POLICY "Admins can view all projects" ON public.projects
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert projects" ON public.projects
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects" ON public.projects
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects" ON public.projects
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for tickets
CREATE POLICY "Admins can view all tickets" ON public.tickets
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tickets" ON public.tickets
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tickets" ON public.tickets
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for profiles (to list clients)
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for project_members
CREATE POLICY "Admins can manage project members" ON public.project_members
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for roadmap_milestones
CREATE POLICY "Admins can manage milestones" ON public.roadmap_milestones
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
