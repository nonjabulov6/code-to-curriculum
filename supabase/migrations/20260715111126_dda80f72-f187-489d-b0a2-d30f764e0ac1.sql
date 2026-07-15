
-- Trigger-only, never called directly
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- has_role is used inside RLS policies (runs as definer, safe). Keep executable to authenticated so client-side role checks work; revoke from anon.
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

-- Replace overly-permissive contact_messages insert policy with validation
drop policy if exists "anyone submit contact" on public.contact_messages;
create policy "anyone submit contact"
  on public.contact_messages for insert to anon, authenticated
  with check (
    char_length(name) between 1 and 120
    and char_length(email) between 3 and 255
    and email ~* '^.+@.+\..+$'
    and char_length(message) between 1 and 5000
  );
