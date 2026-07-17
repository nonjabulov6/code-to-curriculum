-- Add explanation column for quiz feedback
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS explanation text;

-- Remove duplicate/orphan "What is JavaScript?" module
DELETE FROM public.modules WHERE id = 'f1d5e8dd-b328-44c0-921a-1355db5c03b0';