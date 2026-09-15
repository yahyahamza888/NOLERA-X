-- =========================================================
-- NOLERA X — Platform Settings Super Admin Protection
-- Read: authenticated users
-- Write: Super Admin only
-- =========================================================

drop policy if exists "platform_settings_insert"
on public.nolera_platform_settings;

create policy "platform_settings_insert"
on public.nolera_platform_settings
for insert
to authenticated
with check (
  public.nolera_is_super_admin()
);

drop policy if exists "platform_settings_update"
on public.nolera_platform_settings;

create policy "platform_settings_update"
on public.nolera_platform_settings
for update
to authenticated
using (
  public.nolera_is_super_admin()
)
with check (
  public.nolera_is_super_admin()
);

drop policy if exists "platform_settings_delete"
on public.nolera_platform_settings;

create policy "platform_settings_delete"
on public.nolera_platform_settings
for delete
to authenticated
using (
  public.nolera_is_super_admin()
);
