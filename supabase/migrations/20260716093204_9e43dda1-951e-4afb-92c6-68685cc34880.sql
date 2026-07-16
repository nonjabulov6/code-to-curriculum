
DROP POLICY IF EXISTS "admins manage courses" ON public.courses;
CREATE POLICY "staff manage courses" ON public.courses FOR ALL
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'facilitator'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'facilitator'));

DROP POLICY IF EXISTS "admins manage modules" ON public.modules;
CREATE POLICY "staff manage modules" ON public.modules FOR ALL
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'facilitator'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'facilitator'));

DROP POLICY IF EXISTS "admins manage lessons" ON public.lessons;
CREATE POLICY "staff manage lessons" ON public.lessons FOR ALL
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'facilitator'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'facilitator'));

DROP POLICY IF EXISTS "admins manage quiz" ON public.quiz_questions;
CREATE POLICY "staff manage quiz" ON public.quiz_questions FOR ALL
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'facilitator'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'facilitator'));
