
CREATE TABLE public.weekly_routines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  time_slot TEXT,
  xp_reward INTEGER NOT NULL DEFAULT 50,
  completed BOOLEAN NOT NULL DEFAULT false,
  week_start DATE NOT NULL DEFAULT (date_trunc('week', now()))::date,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.weekly_routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own routines" ON public.weekly_routines FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own routines" ON public.weekly_routines FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own routines" ON public.weekly_routines FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own routines" ON public.weekly_routines FOR DELETE TO authenticated USING (auth.uid() = user_id);
