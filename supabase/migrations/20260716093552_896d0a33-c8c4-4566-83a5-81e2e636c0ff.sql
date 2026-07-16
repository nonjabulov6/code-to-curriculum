
CREATE POLICY "users self assign learner or facilitator" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND role IN ('student','facilitator'));
