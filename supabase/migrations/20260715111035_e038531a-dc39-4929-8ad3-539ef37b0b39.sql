
-- Roles enum + table
create type public.app_role as enum ('admin', 'student');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles readable by authenticated" on public.profiles for select to authenticated using (true);
create policy "users update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Auto create profile + assign student role on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), new.email);
  insert into public.user_roles (user_id, role) values (new.id, 'student');
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Courses
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  duration text,
  difficulty text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.courses to anon, authenticated;
grant all on public.courses to authenticated;
grant all on public.courses to service_role;
alter table public.courses enable row level security;
create policy "courses public read" on public.courses for select using (true);
create policy "admins manage courses" on public.courses for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Modules
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  position int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.modules to anon, authenticated;
grant all on public.modules to authenticated;
grant all on public.modules to service_role;
alter table public.modules enable row level security;
create policy "modules public read" on public.modules for select using (true);
create policy "admins manage modules" on public.modules for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Lessons
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  content text,
  code_example text,
  exercise text,
  position int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.lessons to authenticated;
grant all on public.lessons to authenticated;
grant all on public.lessons to service_role;
alter table public.lessons enable row level security;
create policy "lessons readable authenticated" on public.lessons for select to authenticated using (true);
create policy "admins manage lessons" on public.lessons for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Quiz questions (one quiz per module implicitly)
create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  question text not null,
  options jsonb not null,
  correct_index int not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.quiz_questions to authenticated;
grant all on public.quiz_questions to authenticated;
grant all on public.quiz_questions to service_role;
alter table public.quiz_questions enable row level security;
create policy "quiz readable authenticated" on public.quiz_questions for select to authenticated using (true);
create policy "admins manage quiz" on public.quiz_questions for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Enrollments
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (user_id, course_id)
);
grant select, insert, delete on public.enrollments to authenticated;
grant all on public.enrollments to service_role;
alter table public.enrollments enable row level security;
create policy "users read own enrollments" on public.enrollments for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "users create own enrollments" on public.enrollments for insert to authenticated with check (auth.uid() = user_id);
create policy "users delete own enrollments" on public.enrollments for delete to authenticated using (auth.uid() = user_id);

-- Module progress
create table public.module_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  unique (user_id, module_id)
);
grant select, insert, update, delete on public.module_progress to authenticated;
grant all on public.module_progress to service_role;
alter table public.module_progress enable row level security;
create policy "users read own progress" on public.module_progress for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "users write own progress" on public.module_progress for insert to authenticated with check (auth.uid() = user_id);
create policy "users update own progress" on public.module_progress for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Quiz attempts
create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  score int not null,
  total int not null,
  created_at timestamptz not null default now()
);
grant select, insert on public.quiz_attempts to authenticated;
grant all on public.quiz_attempts to service_role;
alter table public.quiz_attempts enable row level security;
create policy "users read own attempts" on public.quiz_attempts for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "users create own attempts" on public.quiz_attempts for insert to authenticated with check (auth.uid() = user_id);

-- Contact messages
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "anyone submit contact" on public.contact_messages for insert to anon, authenticated with check (true);
create policy "admins read contact" on public.contact_messages for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admins delete contact" on public.contact_messages for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Admin can read all profiles
create policy "admins read all profiles" on public.profiles for select to authenticated using (public.has_role(auth.uid(), 'admin'));
