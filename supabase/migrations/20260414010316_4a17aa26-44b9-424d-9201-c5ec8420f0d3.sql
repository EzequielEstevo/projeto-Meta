
-- Create disciplines table
CREATE TABLE public.disciplines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.disciplines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own disciplines" ON public.disciplines FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own disciplines" ON public.disciplines FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own disciplines" ON public.disciplines FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own disciplines" ON public.disciplines FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create topics table
CREATE TABLE public.topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discipline_id UUID NOT NULL REFERENCES public.disciplines(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own topics" ON public.topics FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own topics" ON public.topics FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own topics" ON public.topics FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own topics" ON public.topics FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Add discipline/topic reference to weekly_routines for integration
ALTER TABLE public.weekly_routines ADD COLUMN discipline_id UUID REFERENCES public.disciplines(id) ON DELETE SET NULL;
ALTER TABLE public.weekly_routines ADD COLUMN topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL;
