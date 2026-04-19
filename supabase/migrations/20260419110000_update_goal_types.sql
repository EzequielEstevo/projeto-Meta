-- Update goal_type check constraint
ALTER TABLE public.goals DROP CONSTRAINT IF EXISTS goals_goal_type_check;

ALTER TABLE public.goals ADD CONSTRAINT goals_goal_type_check 
CHECK (goal_type IN ('weekly', 'monthly', 'six_months', 'one_year'));

-- Migrating existing daily goals to weekly or deleting them?
-- Usually, it's safer to move them. But since the user said "remove", I'll just change the default if needed.
-- However, there are already records with 'daily'.
UPDATE public.goals SET goal_type = 'weekly' WHERE goal_type = 'daily';

ALTER TABLE public.goals ALTER COLUMN goal_type SET DEFAULT 'weekly';
