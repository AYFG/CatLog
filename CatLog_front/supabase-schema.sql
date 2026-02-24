-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cats table
CREATE TABLE public.cats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cat_type TEXT,
  birth_date DATE,
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_logs table
CREATE TABLE public.daily_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cat_id UUID REFERENCES public.cats(id) ON DELETE CASCADE NOT NULL,
  defecation BOOLEAN DEFAULT FALSE,
  weight TEXT,
  vitamin BOOLEAN DEFAULT FALSE,
  etc TEXT,
  log_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medical_logs table
CREATE TABLE public.medical_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cat_id UUID REFERENCES public.cats(id) ON DELETE CASCADE NOT NULL,
  health_checkup_date DATE,
  health_cycle INTEGER DEFAULT 12,
  heart_worm DATE,
  heart_worm_cycle INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for cats
CREATE POLICY "Users can view own cats" ON public.cats
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own cats" ON public.cats
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own cats" ON public.cats
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own cats" ON public.cats
  FOR DELETE USING (auth.uid() = owner_id);

-- Create RLS policies for daily_logs
CREATE POLICY "Users can view daily logs for own cats" ON public.daily_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.cats 
      WHERE cats.id = daily_logs.cat_id 
      AND cats.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert daily logs for own cats" ON public.daily_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cats 
      WHERE cats.id = daily_logs.cat_id 
      AND cats.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update daily logs for own cats" ON public.daily_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.cats 
      WHERE cats.id = daily_logs.cat_id 
      AND cats.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete daily logs for own cats" ON public.daily_logs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.cats 
      WHERE cats.id = daily_logs.cat_id 
      AND cats.owner_id = auth.uid()
    )
  );

-- Create RLS policies for medical_logs
CREATE POLICY "Users can view medical logs for own cats" ON public.medical_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.cats 
      WHERE cats.id = medical_logs.cat_id 
      AND cats.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert medical logs for own cats" ON public.medical_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cats 
      WHERE cats.id = medical_logs.cat_id 
      AND cats.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update medical logs for own cats" ON public.medical_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.cats 
      WHERE cats.id = medical_logs.cat_id 
      AND cats.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete medical logs for own cats" ON public.medical_logs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.cats 
      WHERE cats.id = medical_logs.cat_id 
      AND cats.owner_id = auth.uid()
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_cats_owner_id ON public.cats(owner_id);
CREATE INDEX idx_daily_logs_cat_id ON public.daily_logs(cat_id);
CREATE INDEX idx_daily_logs_log_date ON public.daily_logs(log_date);
CREATE INDEX idx_medical_logs_cat_id ON public.medical_logs(cat_id);

