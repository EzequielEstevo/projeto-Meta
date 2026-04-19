-- Add day_of_week to workouts table
ALTER TABLE public.workouts ADD COLUMN IF NOT EXISTS day_of_week INTEGER;

-- Update existing workouts to Monday (0) by default
UPDATE public.workouts SET day_of_week = 0 WHERE day_of_week IS NULL;

-- Make it NOT NULL after setting defaults
ALTER TABLE public.workouts ALTER COLUMN day_of_week SET NOT NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_workouts_day_of_week ON public.workouts(day_of_week);
