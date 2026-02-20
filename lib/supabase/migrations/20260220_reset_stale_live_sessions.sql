-- Reset any lectures stuck in is_live = true where the session would have
-- ended more than 4 hours ago (scheduled_at + duration + 4h buffer).
-- Run this once in the Supabase SQL editor to clear stale live flags.

UPDATE public.lectures
SET is_live = false
WHERE is_live = true
  AND (
    scheduled_at + (duration || ' minutes')::interval + interval '4 hours' < now()
    OR scheduled_at + interval '4 hours' < now()
  );

-- Helper function: call this anytime to clean up stuck sessions.
create or replace function public.reset_stale_live_sessions()
returns void as $$
begin
  update public.lectures
  set is_live = false
  where is_live = true
    and (
      scheduled_at + (duration || ' minutes')::interval + interval '4 hours' < now()
      or scheduled_at + interval '4 hours' < now()
    );
end;
$$ language plpgsql security definer;
