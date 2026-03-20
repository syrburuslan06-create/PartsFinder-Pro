-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'mechanic',
  plan TEXT DEFAULT 'free',
  is_paid BOOLEAN DEFAULT FALSE,
  next_payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  company_id TEXT,
  seats INT DEFAULT 1,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMPTZ,
  is_blocked BOOLEAN DEFAULT FALSE
);

-- Create search_history table
CREATE TABLE IF NOT EXISTS public.search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  query TEXT,
  search_type TEXT,
  results_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  duration_minutes INT DEFAULT 0
);

-- Create saved_parts table
CREATE TABLE IF NOT EXISTS public.saved_parts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mechanic_id UUID REFERENCES auth.users NOT NULL,
  part_number TEXT NOT NULL,
  part_name TEXT NOT NULL,
  price DECIMAL(10, 2),
  suppliers TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create security_events table (used in server.ts)
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  ip_address TEXT,
  email_tried TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create search_cache table
CREATE TABLE IF NOT EXISTS public.search_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query_hash TEXT UNIQUE NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own search history" ON public.search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own search history" ON public.search_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own sessions" ON public.user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sessions" ON public.user_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sessions" ON public.user_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own saved parts" ON public.saved_parts FOR SELECT USING (auth.uid() = mechanic_id);
CREATE POLICY "Users can insert their own saved parts" ON public.saved_parts FOR INSERT WITH CHECK (auth.uid() = mechanic_id);
CREATE POLICY "Users can delete their own saved parts" ON public.saved_parts FOR DELETE USING (auth.uid() = mechanic_id);

-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users NOT NULL,
  seat_limit INT DEFAULT 5,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create company_invites table
CREATE TABLE IF NOT EXISTS public.company_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'worker',
  code TEXT UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

-- Enable RLS for new tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_invites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Users can view their own company" ON public.companies FOR SELECT USING (auth.uid() = owner_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = companies.id::text));
CREATE POLICY "Owners can update their own company" ON public.companies FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can insert their own company" ON public.companies FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- RLS Policies for company_invites
CREATE POLICY "Owners can view their company invites" ON public.company_invites FOR SELECT USING (EXISTS (SELECT 1 FROM public.companies WHERE id = company_invites.company_id AND owner_id = auth.uid()));
CREATE POLICY "Owners can insert company invites" ON public.company_invites FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.companies WHERE id = company_invites.company_id AND owner_id = auth.uid()));
CREATE POLICY "Public can view invite by code" ON public.company_invites FOR SELECT USING (true);

-- Update profiles RLS to allow owners to view their workers
CREATE POLICY "Owners can view their workers" ON public.profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.companies 
    WHERE owner_id = auth.uid() 
    AND id::text = profiles.company_id
  )
);

CREATE POLICY "Owners can update their workers" ON public.profiles FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.companies 
    WHERE owner_id = auth.uid() 
    AND id::text = profiles.company_id
  )
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year TEXT NOT NULL,
  engine TEXT NOT NULL,
  vin TEXT,
  status TEXT DEFAULT 'active',
  last_service TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL, -- 'price_drop', 'maintenance', 'new_part'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for inventory and alerts
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inventory
CREATE POLICY "Users can view their own inventory" ON public.inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own inventory" ON public.inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own inventory" ON public.inventory FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own inventory" ON public.inventory FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for alerts
CREATE POLICY "Users can view their own alerts" ON public.alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON public.alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own alerts" ON public.alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alerts" ON public.alerts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public read for search cache" ON public.search_cache FOR SELECT USING (true);
CREATE POLICY "Admin only insert for search cache" ON public.search_cache FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Trigger for new user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
