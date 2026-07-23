
ALTER TABLE public.surveys
  ADD COLUMN IF NOT EXISTS occupation text,
  ADD COLUMN IF NOT EXISTS age_group text,
  ADD COLUMN IF NOT EXISTS knowledge_before text,
  ADD COLUMN IF NOT EXISTS nps_score integer,
  ADD COLUMN IF NOT EXISTS wants_certificate boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS certificate_name text,
  ADD COLUMN IF NOT EXISTS certificate_email text,
  ADD COLUMN IF NOT EXISTS responses jsonb DEFAULT '{}'::jsonb;

ALTER TABLE public.surveys ALTER COLUMN favourite_module DROP NOT NULL;
