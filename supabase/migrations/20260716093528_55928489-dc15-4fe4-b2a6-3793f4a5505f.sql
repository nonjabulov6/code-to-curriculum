
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  requested text := new.raw_user_meta_data->>'role';
  assigned public.app_role;
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), new.email);

  if requested = 'facilitator' then
    assigned := 'facilitator';
  else
    assigned := 'student';
  end if;

  insert into public.user_roles (user_id, role) values (new.id, assigned);
  return new;
end;
$function$;
