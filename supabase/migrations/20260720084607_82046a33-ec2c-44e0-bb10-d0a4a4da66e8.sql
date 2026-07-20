
CREATE TABLE public.surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  favourite_module TEXT,
  difficulty_rating INT CHECK (difficulty_rating BETWEEN 1 AND 5),
  video_usefulness INT CHECK (video_usefulness BETWEEN 1 AND 5),
  quiz_difficulty INT CHECK (quiz_difficulty BETWEEN 1 AND 5),
  overall_rating INT CHECK (overall_rating BETWEEN 1 AND 5),
  would_recommend BOOLEAN,
  liked_most TEXT,
  suggestions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.surveys TO authenticated;
GRANT INSERT ON public.surveys TO anon;
GRANT ALL ON public.surveys TO service_role;

ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a survey" ON public.surveys FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can view their own surveys" ON public.surveys FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all surveys" ON public.surveys FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
