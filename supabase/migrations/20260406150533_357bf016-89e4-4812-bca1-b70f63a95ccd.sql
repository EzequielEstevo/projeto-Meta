
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL DEFAULT 'Hunter',
  level INTEGER NOT NULL DEFAULT 1,
  current_xp INTEGER NOT NULL DEFAULT 0,
  required_xp INTEGER NOT NULL DEFAULT 1000,
  rank TEXT NOT NULL DEFAULT 'E',
  title TEXT NOT NULL DEFAULT 'Novato',
  intelligence INTEGER NOT NULL DEFAULT 10,
  strength INTEGER NOT NULL DEFAULT 10,
  focus INTEGER NOT NULL DEFAULT 10,
  knowledge INTEGER NOT NULL DEFAULT 10,
  discipline INTEGER NOT NULL DEFAULT 10,
  energy INTEGER NOT NULL DEFAULT 10,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, player_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'player_name', 'Hunter'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Missions table
CREATE TABLE public.missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  rank TEXT NOT NULL DEFAULT 'D',
  status TEXT NOT NULL DEFAULT 'available',
  xp_reward INTEGER NOT NULL DEFAULT 100,
  time_slot TEXT,
  duration TEXT,
  priority TEXT NOT NULL DEFAULT 'normal',
  mission_type TEXT NOT NULL DEFAULT 'daily',
  stat_rewards JSONB DEFAULT '[]'::jsonb,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own missions" ON public.missions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create own missions" ON public.missions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own missions" ON public.missions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own missions" ON public.missions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Subtasks table
CREATE TABLE public.subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subtasks" ON public.subtasks
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.missions WHERE missions.id = subtasks.mission_id AND missions.user_id = auth.uid()));

CREATE POLICY "Users can create own subtasks" ON public.subtasks
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.missions WHERE missions.id = subtasks.mission_id AND missions.user_id = auth.uid()));

CREATE POLICY "Users can update own subtasks" ON public.subtasks
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.missions WHERE missions.id = subtasks.mission_id AND missions.user_id = auth.uid()));

CREATE POLICY "Users can delete own subtasks" ON public.subtasks
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.missions WHERE missions.id = subtasks.mission_id AND missions.user_id = auth.uid()));

-- Achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🏆',
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements" ON public.achievements
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON public.achievements
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
