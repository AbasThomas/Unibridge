-- UniBridge migration: student events + leaderboard profile visibility
-- Run this once in Supabase SQL editor for existing projects.

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Authenticated users can view public profiles'
  ) then
    create policy "Authenticated users can view public profiles"
      on public.profiles for select
      using (auth.role() = 'authenticated');
  end if;
end $$;

create table if not exists public.student_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  details text default '',
  location text not null default '',
  event_date timestamptz not null,
  rsvp_url text default '',
  created_by uuid references public.profiles(id) on delete set null,
  created_by_name text default '',
  university text default '',
  is_virtual boolean default false,
  created_at timestamptz default now()
);

alter table if exists public.student_events enable row level security;

create index if not exists student_events_event_date_idx on public.student_events(event_date);
create index if not exists student_events_created_by_idx on public.student_events(created_by);

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'student_events'
      and policyname = 'Student events viewable by everyone'
  ) then
    create policy "Student events viewable by everyone"
      on public.student_events for select
      using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'student_events'
      and policyname = 'Authenticated users can create student events'
  ) then
    create policy "Authenticated users can create student events"
      on public.student_events for insert
      with check (auth.uid() = created_by);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'student_events'
      and policyname = 'Users can update their own student events'
  ) then
    create policy "Users can update their own student events"
      on public.student_events for update
      using (auth.uid() = created_by);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'student_events'
      and policyname = 'Users can delete their own student events'
  ) then
    create policy "Users can delete their own student events"
      on public.student_events for delete
      using (auth.uid() = created_by);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'student_events'
      and policyname = 'Admins can manage student events'
  ) then
    create policy "Admins can manage student events"
      on public.student_events for all
      using (exists (
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
      ));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'student_events'
  ) then
    alter publication supabase_realtime add table public.student_events;
  end if;
end $$;
