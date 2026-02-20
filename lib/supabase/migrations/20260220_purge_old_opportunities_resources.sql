-- UniBridge migration: purge existing opportunities and resources
-- Run once in production to clear old seeded/user-submitted records.

begin;

delete from public.opportunities;
delete from public.resources;

-- NOTE:
-- Do not delete directly from storage.objects in Supabase SQL editor.
-- Supabase blocks direct storage table deletes (storage.protect_delete).
-- If you want to remove physical files, use the Supabase Storage API or dashboard.

commit;
