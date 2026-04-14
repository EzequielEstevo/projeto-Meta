
-- 1. Add missing UPDATE and DELETE policies on achievements
CREATE POLICY "Users can update own achievements"
ON public.achievements
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own achievements"
ON public.achievements
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 2. Fix goals policies: drop public-role policies and recreate as authenticated
DROP POLICY IF EXISTS "Users can create own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can update own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can view own goals" ON public.goals;

CREATE POLICY "Users can view own goals"
ON public.goals FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals"
ON public.goals FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
ON public.goals FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
ON public.goals FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 3. Restrict storage listing on avatars bucket
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
