-- NOLERA X C3
-- Allow authenticated users to read public platform appearance/navigation settings.

drop policy if exists "platform_settings_select" on public.nolera_platform_settings;

create policy "platform_settings_select"
on public.nolera_platform_settings
for select
to authenticated
using (true);
